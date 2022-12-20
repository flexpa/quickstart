import { LinkExchangeResponse } from "./flexpa_types";

function displaySuccessMessage(app: LinkExchangeResponse) {
  return /* html */ `
    <div class='section-container'>
        <h2>
            Success, your health plan has been linked!
        </h2>
        <div>
            The access token is now stored in the AppContext.
            The application is ready to make FHIR resource requests.
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
