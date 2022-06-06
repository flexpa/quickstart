import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import fetch from 'node-fetch';

import 'dotenv/config';
const app = express();

// require('dotenv').config();

// The server and front-end server run on different origins (localhost:3000 and localhost:9000 respectively).
// Without CORS handling, the browser will not allow the frontend to make requests to the backend.
// Use the `cors()` to inject `Access-Control-Allow-Origin: *` header to preflight requests.
// In a production environment it's important to handle this more intelligently (see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
app.use(cors());

// pre-parse the JSON body when appropriate
app.use(bodyParser.json());

app.post("/flexpa-access-token", async (req: Request, res: Response) => {
    const { publicToken } = req.body;
    console.log("process.env.FLEXPA_PUBLIC_API_BASE_URL", process.env.FLEXPA_PUBLIC_API_BASE_URL, process.env.FLEXPA_API_SECRET_KEY)
    // call Flexpa API's exchange endpoint to exchange your `publicToken` for an `access_token` and a `patient_id`
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

    const { access_token: accessToken, patient_id: patientId } = await resp.json();

    // send the `accessToken` and `patientId` back to the client
    res.send({ accessToken, patientId });
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

