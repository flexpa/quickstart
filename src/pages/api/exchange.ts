import type { NextApiRequest, NextApiResponse } from 'next';

interface LinkExchangeResponse {
    access_token: string;
    patient_id: string;
    expires_in: number;
}

// Exchange flexpa/link public token for an API access token. 
// Visit https://flexpa.com/docs/sdk/api#link-exchange for more information
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const publicToken = req.query.public_token;
    if (!process.env.FLEXPA_PUBLIC_API_BASE_URL) {
        return res.status(500).send(new Error('Invalid public API base URL'));
    }
    const result = await fetch(`${process.env.FLEXPA_PUBLIC_API_BASE_URL}/link/exchange`, {
        method: 'POST',
        body: JSON.stringify({
            public_token: publicToken,
            secret_key: process.env.FLEXPA_API_SECRET_KEY,
        }),
        headers: { 'Content-Type': 'application/json' },
    });

    const json = (await result.json()) as LinkExchangeResponse;
    res.status(200).json(json);
}
