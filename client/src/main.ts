import './style.css'
interface FlexpaConfig {
    publishableKey: string;
    onSuccess: (publicToken: string) => {};
}
declare const FlexpaLink: {
    create: (config: FlexpaConfig) => {},
    open: () => {}
};

interface LinkExchangeResponse {
    accessToken: string;
    patientId: string;
    expiresIn: number;
}
// // TODO - Initialize the event handlers
// const main = () => {
//     document.getElementById("")
// }

/**
 * Event handler for flexpa link button
 */
FlexpaLink.create({
    publishableKey: import.meta.env.VITE_FLEXPA_PUBLISHABLE_KEY,
    onSuccess: async (publicToken: string) => {
        // make a request to the `POST /flexpa-access-token` endpoint that we wrote in `server`.
        // include the `publicToken` in the body.
        let resp;
        try {
            resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/flexpa-access-token`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ publicToken }),
            });
        }
        catch (err) {
            console.log("err", err);
        }

        if (!resp) {
            return;
        }
        // parse the response body
        const { accessToken, patientId } = await resp.json() as LinkExchangeResponse;
        const accessTokenDiv = document.getElementById("flexpa-access-token");
        if (!accessTokenDiv) {
            console.log("div find error ") // TODO handle error nicely
            return;
        }
        // TODO - this could be cleaner 
        accessTokenDiv.innerHTML = `
        <div>
            <div> 
                Access Token ${accessToken}
            </div>
            <div>
                Patient ID
                ${patientId}
            </div>
        </div>`

        // using the accessToken and patientId returned from `POST /flexpa-access-token` make a request
        // to the patient's payer FHIR server through `https://api.flexpa.com/fhir`.
        // include the `patientId` in the query parameter and the `accessToken` within the `authorization`
        // HTTP header.
        const fhirResp = await fetch(`${import.meta.env.VITE_FLEXPA_PUBLIC_FHIR_BASE_URL}/Coverage?patient=Patient/${patientId}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });

        // parse the response body
        const fhirBody = await fhirResp.json();

        // display some information coverage information
        // see https://www.hl7.org/fhir/coverage.html for available fields
        const coverageHTMLs = fhirBody.entry.map(
            ({ resource }) =>
                `<dl>` +
                `<dt>ID</dt>` +
                `<dd>${resource.id}</dd>` +
                `<dt>Period Start</dt>` +
                `<dd>${resource.period?.start ?? ""}</dd>` +
                `<dt>Period End</dt>` +
                `<dd>${resource.period?.end ?? ""}</dd>` +
                `<dt>Type</dt>` +
                `<dd>${resource.type?.text ?? ""}</dd>` +
                `<dt>Status</dt>` +
                `<dd>${resource.status}</dd>` +
                `<dt>Payor</dt>` +
                `<dd>${resource.payor?.[0].display ?? ""}</dd>` +
                `</dl>`
        );
        const appDiv = document.getElementById("app");

        if (appDiv) {
            appDiv.innerHTML = coverageHTMLs.join("\n");
        }
    },
});

const button = document.getElementById("flexpa-link-btn");
// TODO - Might be a better way to handle this
if (button) {
    button.addEventListener("click", () => {
        FlexpaLink.open();
    });
}
