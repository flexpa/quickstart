import { LinkExchangeResponse } from "./flexpa_types";

function displaySuccessMessage(app: LinkExchangeResponse) {
    return /* html */ `
        <div className='page-container'>
            <div className='section-container'>
                <h1>
                    Success, your health plan has been linked!
                </h1>
                <div>
                    The access token and patient ID are now stored in the AppContext.
                    The application is ready to start making FHIR resource requests.
                </div>
            </div>
            <div>
                <div className='app-context'>
                    <div className='table-heading'>Patient ID</div>
                    <div className='code'>${app?.patientId}</div>
                </div>
                <div className='app-context'>
                    <div className='table-heading'>Access Token</div>
                    <div className='code'>${app?.accessToken}</div>
                </div>
            </div>
        </div>
        `
}

export default displaySuccessMessage;