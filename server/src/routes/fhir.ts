import express, { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { Bundle} from 'fhir/r4';


const router: Router = express.Router();

/**
 * Handles FHIR requests
 */
router.use("/fhir", async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { path } = req;
    if (!authorization) return res.status(401).send('All requests must be authenticated.');

  // Call Flexpa FHIR API
  try {
    const fhirResp = await fetch(`${process.env.FLEXPA_PUBLIC_API_BASE_URL}${path}`, {
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
    return res.status(500).send(`Error retrieving FHIR: ${err}`);
  }

});


export default router;
