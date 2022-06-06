const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

const PORT = 9000;
const SECRET_KEY = "sk_test_N4RyLIeEsYAUEKFdOVHNHd-yAgNHHosWNYqVLszMGfg";

// The server and front-end server run on different origins (localhost:3000 and localhost:9000 respectively).
// Without CORS handling, the browser will not allow the frontend to make requests to the backend.
// Use the `cors()` to inject `Access-Control-Allow-Origin: *` header to preflight requests.
// In a production environment it's important to handle this more intelligently (see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
app.use(cors());

// pre-parse the JSON body when appropriate
app.use(bodyParser.json());

app.post("/flexpa-access-token", async (req, res) => {
    const { publicToken } = req.body;

    // call Flexpa API's exchange endpoint to exchange your `publicToken` for an `access_token` and a `patient_id`
    const resp = await fetch("https://api.flexpa.com/link/exchange", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            public_token: publicToken,
            secret_key: SECRET_KEY,
        }),
    });

    const { access_token: accessToken, patient_id: patientId } = await resp.json();

    // send the `accessToken` and `patientId` back to the client
    res.send({ accessToken, patientId });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
