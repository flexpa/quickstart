## Prerequisites

You must have valid public and secret keys for Flexpa API. Contact us [here](https://automatemedical.typeform.com/to/mtwkkY2r?typeform-source=quickstart) to obtain them.
Once you have the API keys, you're ready to go!

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
During development, you will likely want to use the test mode keys rather than the production ones.

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
