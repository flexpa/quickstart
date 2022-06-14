## Prerequisites

You must have valid publishable and secret keys for Flexpa API. Contact us [here](https://automatemedical.typeform.com/to/mtwkkY2r?typeform-source=quickstart) to obtain them.
Once you have the API keys, you're ready to go!

Node must be installed on your machine.

## Update environment variables

You'll need to add your Flexpa secret key to a `.env` file.
Rename the file `.env.template` to `.env` and update the value for `FLEXPA_API_SECRET_KEY` to include your secret key.
During development, you will likely want to use the test mode key rather than the production one.

## Run the Project

To run the development server, start in the quickstart directory then run these commands:

```bash
cd server

nvm use

npm install

npm run build

npm run dev
```

You should see the console message `Server listening on port 9000` indicating that the server has started.
