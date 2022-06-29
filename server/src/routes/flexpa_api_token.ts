import express, { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router: Router = express.Router();

interface LinkExchangeResponse {
  access_token: string;
  expires_in: number;
}

interface FlexpaAccessTokenBody {
  publicToken: string;
}
/**
 * POST /flexpa-access-token
 * Exchanges your `publicToken` for an `access_token`
 */
router.post("/flexpa-access-token", async (req: Request, res: Response) => {
  const { publicToken } = req.body as FlexpaAccessTokenBody;

  if (!publicToken) {
    return res.status(400).send('Invalid Flexpa public token');
  }

  if (!process.env.FLEXPA_PUBLIC_API_BASE_URL) {
    return res.status(500).send('Invalid public API base URL');
  }

  // Call Flexpa API's exchange endpoint to exchange your `publicToken` for an `access_token`
  try {
    const resp = await fetch(`${process.env.FLEXPA_PUBLIC_API_BASE_URL}/link/exchange`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        public_token: publicToken,
        secret_key: process.env.FLEXPA_API_SECRET_KEY,
      }),
    });
    const { access_token: accessToken, expires_in: expiresIn } = await resp.json() as LinkExchangeResponse;

    res.send({ accessToken, expiresIn });
  }
  catch (err) {
    return res.status(500).send(`Error exchanging token: ${err}`);
  }

});


export default router;
