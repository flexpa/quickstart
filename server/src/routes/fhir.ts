import express, { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { Bundle } from 'fhir/r4';


const router: Router = express.Router();

/**
 * Handles FHIR requests by proxying all requests to the patient's payer FHIR server via https://api.flexpa.com/fhir. This router also appends the received URL path to the outbound request URL.
 */
router.use("/", async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { path } = req;
    if (!authorization) return res.status(401).send('All requests must be authenticated.');

  // Call Flexpa FHIR API
  try {
    const fhirResp = await fetch(`${process.env.FLEXPA_PUBLIC_API_BASE_URL}/fhir${path}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": authorization,
      }
    });
    const fhirBody: Bundle = await fhirResp.json();
    res.send(fhirBody);
  }
  catch (err) {
    console.log(`Error retrieving FHIR: ${err}`);
    return res.status(500).send(`Error retrieving FHIR: ${err}`);
  }

});


export default router;
