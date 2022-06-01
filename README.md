## Prerequisites

You must have valid public and secret keys for Flexpa API. Contact us [here](https://automatemedical.typeform.com/to/mtwkkY2r?typeform-source=quickstart) to obtain them.
Once you have the API keys, you're ready to go!

Node must be installed.

## Clone the Repository

First you must clone the quickstart repository. You can do this using HTTPS:

```bash
git clone https://github.com/flexpa/quickstart.git
cd quickstart
```

Or by using SSH:

```bash
git@github.com:flexpa/quickstart.git
cd quickstart
```

## Update environment variables

You'll need to add your Flexpa public and secret keys to a `.env.local` file.
Rename the file `.env.template` to `.env.local` and update the values to include your public and secret keys.
During development, you will likely want to use the test mode keys rather than the production ones.

You will also notice that the

## Run the Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
nvm use

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
