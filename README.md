# <img src="./flexpa_logo.png" height="60px" align="center" alt="Flexpa logo"> Flexpa Quickstart

This repository is a companion to Flexpa's [quickstart guide](https://www.flexpa.com/docs/guides/quickstart) which also provides a detailed explanation of how this code example works.
Please use our [community discussions](https://github.com/flexpa/community/discussions) for support and issues with this code.

## Prerequisites

The quickstart assumes you have [NodeJS (v16.14.2+) and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) already installed.

## Clone repo

First, clone the quickstart repository:

```bash
git clone https://github.com/flexpa/quickstart.git
```

## Set API keys

Second, create an account in our [developer portal](https://portal.flexpa.com/) to get your test mode keys. (When you're ready, you can request live mode access within the developer portal.)

You'll need to add your publishable and secret API keys to the `.env` files in the client and server directories.

Rename the `.env.template` file as `.env` in both directories.

```bash 
cd quickstart
cp client/.env.template client/.env 
cp server/.env.template server/.env 
```

Open both `client/.env` and `server/.env` and add your test mode API keys.

```bash
# client/.env
VITE_FLEXPA_PUBLISHABLE_KEY=
```

```bash
# server/.env
FLEXPA_API_SECRET_KEY=
```

## Run project

The quickstart code includes two components:
* Frontend client for creating the Flexpa Link connection to a health plan
* Backend server that swaps a public token for an access token 

Run both components simultaneously to test the application. From the root of the project, run the frontend client:

```bash
# Navigate into the client directory
cd client

# Set the correct node version
nvm use

# Install the dependencies
npm install

# Run the frontend server
npm run dev
```

**Note:** `nvm` is not supported on Windows. If you are using Windows, ensure you have the correct version of Node installed. See `.nvmrc` for the recommended version.

Next, from the root of the project in a new terminal, run the backend server:

```bash
# Navigate into the server directory
cd server

# Set the correct node version
nvm use

# Install the dependencies
npm install

# Compile the TypeScript to JavaScript code
npm run build

# Run the backend server
npm run dev
```

## Test application

To test the quickstart app: 

1. Open <a href="http://localhost:3000" target="_blank">http://localhost:3000 </a> in your browser.
1. Click the "Connect your health plan with Flexpa Link" to open the Flexpa Link modal.
1. Select any health plan payer from the list.
1. When directed to the provider's site, authenticate using a <a href="https://www.flexpa.com/docs/getting-started/test-mode#test-mode-logins" target="_blank">test mode login</a>.
1. When Flexpa Link indicates success, click "Continue".

Upon successful authentication, you'll be redirected back to localhost. The server script automatically exchanges the public token for an access token, and then the client app performs a FHIR request and reports upon the result. (This may take a moment to complete.)

## Use Docker

To use Docker Compose with this project, add your Flexpa publishable and secret keys to `compose.yaml`:

```bash
VITE_FLEXPA_PUBLISHABLE_KEY=
FLEXPA_API_SECRET_KEY=
```

Then, run the project with:

```bash
docker-compose up --build
```
