# <img src="./public/logo.png" height="60px" align="center" alt="Flexpa logo"> Flexpa Quickstart

This repository is a companion to Flexpa's [Quickstart guide](https://www.flexpa.com/docs/guides/quickstart) which provides a detailed explanation of how this code example works.

This quickstart showcases how to obtain a patient's claims history from a health plan using Flexpa's consent flow and coverage network.

![Flexpa quickstart app](/public/quickstart.png)

## Prerequisites

The quickstart assumes you have [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) already installed. The project is built on Next.js.

Your Flexpa API keys can be found in our [Developer Portal](https://portal.flexpa.com/). Please contact support@flexpa.com if you need keys.

## Clone

First, clone the quickstart repository.

```bash
git clone https://github.com/flexpa/quickstart.git
```

## Setup
Copy the `.env.example` file to `.env` and add your API keys.

```bash
cp .env.example .env
```

You must generate a random value for `SESSION_SECRET` in `.env`. One way is to use the following command:

```bash
openssl rand -base64 32
```

## Development

To run the project:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Health Records Agent (Optional)

The quickstart includes an AI-powered chat assistant at `/chat` that can answer questions about a patient's claims, demographics, and insurance coverage.

To enable it, add an API key to your `.env` file for at least one provider:

```bash
# Anthropic (default)
ANTHROPIC_API_KEY=your-key-here

# or OpenAI
OPENAI_API_KEY=your-key-here
```

The chat route at `src/app/api/chat/route.ts` uses Anthropic by default. You can swap the model by uncommenting the OpenAI import and changing the `model` parameter. The AI SDK supports [many other providers](https://sdk.vercel.ai/docs/foundations/providers-and-models) as well — including Google, Mistral, and more.

This is a minimal implementation to demonstrate the concept — in production, you would likely add more tools, refine the system prompt, implement guardrails, and tailor the agent to your specific use case.

## Testing

To test the quickstart app: 

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click the "Connect your health plan with Flexpa Link" to open the Flexpa Link modal
3. Select any health plan payer from the list
4. When directed to the provider's site, authenticate using a [test mode login](https://www.flexpa.com/docs/getting-started/test-mode#test-mode-logins)
5. When Flexpa Link indicates success, click "Continue"

Upon successful authentication, the application will automatically exchange the public token for an access token and perform a FHIR request to demonstrate the connection.