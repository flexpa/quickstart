import { Bundle } from "fhir/r4";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

/**
 *  This function retries a fetch request if the response is a 429 Too Many Requests.
 *  This is necessary because the Flexpa API may return a 429 if the data has not yet been loaded into the cache.
 */
async function fetchWithRetry(
  url: string,
  authorization: string,
  maxRetries = 10,
) {
  let retries = 0;
  let delay = 1;
  while (retries < maxRetries) {
    try {
      console.log(`Fetching ${url}, retries: ${retries}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: authorization,
          "x-flexpa-raw": "0",
        },
      });
      if (response.status !== 429) {
        console.log(`Received ${response.status} from ${url}`);
        return response;
      }
      const retryAfter = response.headers.get("Retry-After") || delay;
      await new Promise((resolve) =>
        setTimeout(resolve, Number(retryAfter) * 1000),
      );
      retries++;
      delay *= 2; // Double the delay for exponential backoff
    } catch (err) {
      console.log(`Error fetching ${url}: ${err}`);
      throw err;
    }
  }

  throw new Error("Max retries reached.");
}

/**
 * Handles FHIR requests by proxying all requests to the patient's payer FHIR server via https://api.flexpa.com/fhir.
 * This router also appends the received URL path to the outbound request URL.
 */
router.get("*", async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("All requests must be authenticated.");
  }

  const { href } = new URL(
    `fhir${req.path}`,
    process.env.FLEXPA_PUBLIC_API_BASE_URL,
  );

  try {
    const fhirResp = await fetchWithRetry(href, authorization);
    const fhirBody: Bundle = await fhirResp.json();
    res.send(fhirBody);
  } catch (err) {
    console.log(`Error retrieving FHIR: ${err}`);
    return res.status(500).send(`Error retrieving FHIR: ${err}`);
  }
});

export default router;
