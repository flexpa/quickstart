## Prerequisites

You must have valid publishable and secret keys for Flexpa API. Contact us [here](https://automatemedical.typeform.com/to/mtwkkY2r?typeform-source=quickstart) to obtain them.
Once you have the API keys, you're ready to go!

Node must be installed on your machine.

## Update environment variables

You'll need to add your Flexpa publishable and secret keys to a `.env` file.
Rename the file `.env.template` to `.env` and update the value for `VITE_FLEXPA_PUBLISHABLE_KEY` to include your publishable key.
During development, you will likely want to use the test mode key rather than the production one.

## Run the Project

To run the development client, start in the quickstart directory then run these commands:

```bash
cd client

nvm use # Note - nvm is not supported on Windows. Instead, ensure you have the correct version of node installed (see .nvmrc).

npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You will also need the server running for this example to work.
