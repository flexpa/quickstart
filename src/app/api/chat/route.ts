import { anthropic } from '@ai-sdk/anthropic';
import { createMCPClient, type MCPClient } from '@ai-sdk/mcp';
// import { openai } from '@ai-sdk/openai';
import { createAgentUIStreamResponse, ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { coverageDetails } from '@/lib/viewDefinitions/coverageDetails';
import { eobDetailsUnified } from '@/lib/viewDefinitions/eobDetailsUnified';
import { patientDetails } from '@/lib/viewDefinitions/patientDetails';
import { runViewDefinition } from '@/lib/viewDefinitions/runViewDefinition';

// Flexpa Consent MCP server. It accepts the patient access token this app
// already holds, and serves Flexpa's patient records tools.
// Docs: https://www.flexpa.com/docs/guides/agents
const FLEXPA_CONSENT_MCP_URL = 'https://api.flexpa.com/mcp/consent';

// How long to wait for the MCP server before falling back to the local tools.
const MCP_CONNECT_TIMEOUT_MS = 5_000;
const MCP_TOOLS_TIMEOUT_MS = 5_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  // Connect to the Flexpa Consent MCP server with the patient access token.
  // If it can't be reached, the agent still runs with the local tools below.
  // Both steps have a deadline, so a stalled server can't hold up the chat.
  let mcpClient: MCPClient | undefined;
  let mcpTools: Awaited<ReturnType<MCPClient['tools']>> = {};

  // Close the MCP client exactly once, whatever happens to the request.
  let mcpClosed = false;
  const closeMcpClient = async () => {
    if (mcpClosed || !mcpClient) return;
    mcpClosed = true;
    try {
      await mcpClient.close();
    } catch (error) {
      console.error('Failed to close Flexpa Consent MCP client', error);
    }
  };

  try {
    mcpClient = await createMCPClient({
      transport: {
        type: 'http',
        url: FLEXPA_CONSENT_MCP_URL,
        headers: { Authorization: `Bearer ${session.accessToken}` },
      },
      // Bounds transport startup and the initialize request.
      initializationOptions: {
        signal: AbortSignal.timeout(MCP_CONNECT_TIMEOUT_MS),
      },
    });
    mcpTools = await withTimeout(
      mcpClient.tools(),
      MCP_TOOLS_TIMEOUT_MS,
      'Flexpa Consent MCP tool discovery',
    );
  } catch (error) {
    console.error(
      'Flexpa Consent MCP unavailable, using local tools only',
      error,
    );
    await closeMcpClient();
    mcpClient = undefined;
    mcpTools = {};
  }

  const agent = new ToolLoopAgent({
    // You can swap the model provider below. Examples:
    // model: openai('gpt-5'),
    model: anthropic('claude-sonnet-4-6'),
    instructions:
      "You are a helpful health records assistant. Answer questions about the patient's health records, demographics, and insurance coverage. Prefer the Flexpa patient records tools when they are available. Be concise and translate medical jargon into plain language.",
    tools: {
      ...mcpTools,
      search_records: tool({
        description:
          "Search the patient's claims and explanation of benefits (EOB) records including diagnoses, procedures, costs, and providers",
        inputSchema: z.object({}),
        execute: async () =>
          runViewDefinition(session.accessToken, eobDetailsUnified),
      }),
      search_patient: tool({
        description:
          "Search the patient's demographic information including name, date of birth, gender, address, and contact details",
        inputSchema: z.object({}),
        execute: async () =>
          runViewDefinition(session.accessToken, patientDetails),
      }),
      search_coverage: tool({
        description:
          "Search the patient's insurance coverage information including plan details, subscriber info, payor, and network",
        inputSchema: z.object({}),
        execute: async () =>
          runViewDefinition(session.accessToken, coverageDetails),
      }),
    },
  });

  try {
    return await createAgentUIStreamResponse({
      agent,
      uiMessages: messages,
      // Runs when the stream ends: finished, errored or aborted.
      onFinish: closeMcpClient,
    });
  } catch (error) {
    await closeMcpClient();
    throw error;
  }
}
