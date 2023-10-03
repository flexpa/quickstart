import "./style.css";
import { FlexpaConfig, LinkExchangeResponse } from "./flexpa_types";
import displaySuccessMessage from "./link_success";
import displayCoverage from "./coverage_display";
import { Bundle, Coverage, Patient } from "fhir/r4";
import displayFlexpaLinkButton from "./flexpa_link_button";
import displayLoading from "./loading";

// Let Typescript know about the FlexpaLink object from the link script
declare const FlexpaLink: {
  create: (config: FlexpaConfig) => Record<string, unknown>;
  open: () => Record<string, unknown>;
};

  /**
   *  This function retries a fetch request if the response is a 429 Too Many Requests.
   *  This is necessary because the Flexpa API may return a 429 if the data has not yet been loaded into the cache.
   */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 10) {
  let retries = 0;
  let delay = 1000;  // Initial delay is 1 second

  const augmentedHeaders = {
    ...options.headers,
    "x-flexpa-raw": "0"
  };

  while (retries < maxRetries) {
    const response = await fetch(url, {...options, headers: augmentedHeaders});

    if (response.status !== 429) {
      return response;
    }

    const retryAfter = response.headers.get("Retry-After") || delay;
    await new Promise(resolve => setTimeout(resolve, Number(retryAfter) * 1000));

    retries++;
    delay *= 2;  // Double the delay for exponential backoff
  }

  throw new Error("Max retries reached.");
}


function initializePage() {
  if (!import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY) {
    console.error(
      "No publishable key found. Set VITE_FLEXPA_PUBLISHABLE_KEY in .env"
    );
  }
  /**
   * Initialize the FlexpaLink object
   * This requires your publishable_key_test or publishable_key_live to be set in .env
   */
  FlexpaLink.create({
    publishableKey: import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY,
    onSuccess: async (publicToken: string) => {
      /*  Make a request to the `POST /flexpa-access-token` endpoint that we wrote in `server`.
          include the `publicToken` in the body. */
      let resp;
      try {
        resp = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/flexpa-access-token`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ publicToken }),
          }
        );
      } catch (err) {
        console.log("err", err);
      }

      if (!resp) {
        return;
      }

      // Parse the response body
      const { accessToken, expiresIn } =
        (await resp.json()) as LinkExchangeResponse;
      const flexpaLinkDiv = document.getElementById("flexpa-link");
      if (!flexpaLinkDiv) {
        console.error("Could not find the Flexpa Link div");
        return;
      }

      flexpaLinkDiv.innerHTML = displaySuccessMessage({
        accessToken,
        expiresIn,
      });

      const appDiv = document.getElementById("coverage-container");
      if (!appDiv) {
        return;
      }

      // Display loading message for coverage cards
      appDiv.innerHTML = /* html */ `
      <h2>Patient Coverage</h2>      
      <div>
        <p><a href="https://www.flexpa.com/docs/guides/coverage">Coverage</a> is a FHIR resource that describes the financial terms of a specific health insurance plan for a specific person.</p>
        <p>View more information on FHIR resource requests in the <a href="https://www.flexpa.com/docs">Flexpa docs</a>.</p>
      </div>
      <div id="coverage-list">
        ${displayLoading()}
      </div>
      `;

      /*  Using the accessToken returned from `POST /flexpa-access-token` make a search request
          to the patient's payer FHIR server through `https://api.flexpa.com/fhir`.
          Include the `$PATIENT_ID` wildcard in the query parameter and the `accessToken` within the `authorization`
          HTTP header. */
      let fhirCoverageResp;
      let fhirCoverageBody: Bundle;
      try {
         fhirCoverageResp = await fetchWithRetry(
          `${import.meta.env.VITE_SERVER_URL}/fhir/Coverage?patient=$PATIENT_ID`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Parse the Coverage response body
        fhirCoverageBody = await fhirCoverageResp.json();
      } catch (err) {
        console.log("Coverage error: ", err);
        return;
      }
      if (!fhirCoverageResp.ok) {
        console.error(`Fetch failed with status: ${fhirCoverageResp.status}`);
        return;
      }

      /*  Load the current Patient using a FHIR read request
          see https://www.hl7.org/fhir/patient.html for available fields */

      let fhirPatientResp;
      let fhirPatientBody: Patient;
      try {
         fhirPatientResp = await fetchWithRetry(
          `${import.meta.env.VITE_SERVER_URL}/fhir/Patient/$PATIENT_ID`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Parse the Coverage response body
        fhirPatientBody = await fhirPatientResp.json();
      } catch (err) {
        console.log("Patient error: ", err);
        return;
      }
      if (!fhirPatientResp.ok) {
        console.error(`Fetch failed with status: ${fhirPatientResp.status}`);
        return;
      }


      /*  Display some information coverage information
          see https://www.hl7.org/fhir/coverage.html for available fields */
      const coverageHTMLs = fhirCoverageBody?.entry?.map((entry) =>
        displayCoverage(entry.resource as Coverage | undefined, fhirPatientBody)
      );
      const coverageListDiv = document.getElementById("coverage-list");

      if (coverageListDiv && coverageHTMLs) {
        coverageListDiv.innerHTML = coverageHTMLs.join("\n");
      }
    },
  });

  const flexpaLinkDiv = document.getElementById("flexpa-link");
  if (!flexpaLinkDiv) {
    console.error("Could not find the Flexpa Link div");
    return;
  }
  flexpaLinkDiv.innerHTML = displayFlexpaLinkButton();

  const linkButton = document.getElementById("flexpa-link-btn");
  if (!linkButton) {
    console.error("Could not find the Flexpa Link button");
    return;
  }
  linkButton.addEventListener("click", () => {
    FlexpaLink.open();
  });
}

initializePage();
