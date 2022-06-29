import { LinkExchangeResponse } from "./flexpa_types";

function displaySuccessMessage(app: LinkExchangeResponse) {
  return /* html */ `
    <div class='section-container'>
        <h1>
            Success, your health plan has been linked!
        </h1>
        <div>
            The access token and patient ID are now stored in the AppContext.
            The application is ready to start making FHIR resource requests.
        </div>
    </div>
    <div>
        <div class='app-context'>
            <div class='table-heading'>Access Token</div>
            <div class='code'>${app?.accessToken}</div>
        </div>
    </div>
  `;
}

export default displaySuccessMessage;
