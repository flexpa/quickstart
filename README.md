# <img src="./flexpa_logo.png" height="60px" align="center" alt="Flexpa logo"> Flexpa Quickstart

This repository is a companion to Flexpa's [quickstart guide](https://www.flexpa.com/docs/guides/quickstart).

## Prerequisites

You must have valid publishable and secret keys for Flexpa API. [Generate](https://www.flexpa.com/docs/sdk/api#keys) test mode API keys or [contact us](https://automatemedical.typeform.com/to/mtwkkY2r?typeform-source=quickstart) to obtain production API keys. Once you have the API keys, you're ready to go!

Node must be installed on your machine.

## Clone the Repository

First you must clone the quickstart repository. You can do this using HTTPS:

```bash
git clone https://github.com/flexpa/quickstart.git
cd quickstart
```

## Update environment variables

You'll need to add your Flexpa publishable and secret keys to a `.env` file in the client and server directories.
Rename the files `.env.template` to `.env` in both directories and update the values to your publishable and secret keys.

```bash
cp client/.env.template client/.env
cp server/.env.template server/.env
```

Open both `client/.env` and `server/.env` in a text editor and replace the values with your Test Mode API keys. Remember to save!

```bash
# client/.env
VITE_FLEXPA_PUBLISHABLE_KEY=
```

```bash
# server/.env
FLEXPA_API_SECRET_KEY=
```

During development, you will need to use the test mode API keys rather than the production ones.

## Run the Project

First, run the development client:

```bash
cd client

nvm use

npm install

npm run dev
```

Next, run the development server:

```bash
cd server

nvm use

npm install

npm run build

npm run dev
```

**Note:** `nvm` is not supported on Windows. If you are using Windows, ensure you have the correct version of Node installed. See `.nvmrc` for the recommended version.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can use the following test patient login with Humana:

- **Username:** HUser00007

- **Password:** PW00007!
