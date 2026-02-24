import { anthropic } from '@ai-sdk/anthropic';
// import { openai } from '@ai-sdk/openai';
import { createAgentUIStreamResponse, ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { coverageDetails } from '@/lib/viewDefinitions/coverageDetails';
import { eobDetailsUnified } from '@/lib/viewDefinitions/eobDetailsUnified';
import { patientDetails } from '@/lib/viewDefinitions/patientDetails';
import { runViewDefinition } from '@/lib/viewDefinitions/runViewDefinition';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  const agent = new ToolLoopAgent({
    // You can swap the model provider below. Examples:
    // model: openai('gpt-5'),
    model: anthropic('claude-sonnet-4-6'),
    instructions:
      "You are a helpful health records assistant. Answer questions about the patient's health records, demographics, and insurance coverage. Be concise and translate medical jargon into plain language.",
    tools: {
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

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
