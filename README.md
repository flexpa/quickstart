# <img src="./flexpa_logo.png" height="60px" align="center" alt="Flexpa logo"> Health Data  


## Flexpa Link

Use Link to help your users connect health plan data to your app
Adding Flexpa Link to your app lets your users authorize access to their health plan data. Your app can then use the Flexpa API to retrieve patient health plan and clinical data.

Flexpa Link will handle the SMART on FHIR authentication flow and error handling for each health data source that we support. Flexpa Link works across all modern browsers.
 


You must have valid publishable and secret keys for Flexpa API. [Generate](https://www.flexpa.com/docs/sdk/api#keys) test mode API keys or [contact us](https://automatemedical.typeform.com/to/mtwkkY2r?typeform-source=quickstart) to obtain production API keys. Once you have the API keys, you're ready to go!

Node must be installed on your machine.

## API reference


Use the API to retrieve claims and clinical data from a linked health plan

The Flexpa API is a REST API. Our API functions as an opinionated request proxy layer for FHIR. Every resource available in the API conforms to one available in FHIR.

You can use the Flexpa API in test mode, which doesn't use real patient data. The API key you use to authenticate the request determines whether the request is made in live mode or test mode.

To start using Flexpa API, your users must link their health plan with Flexpa Link.

## URL
The base URL for the Flexpa API is https://api.flexpa.com. All API requests must be made over HTTPS. Calls made over plain HTTP will fail.

Wildcard parameters
Flexpa API supports Wildcard Parameters that can be used in URL query parameters in FHIR Resources API requests.

They are used as tokens directly in the URL of the API request you make to Flexpa. They are replaced with real values by the API using context provided by the required Patient Access Token.

We currently support one parameter:

$PATIENT_ID - References the patient_id belonging to the access_token.
Can be used directly in the URL, or with a search parameter of patient (see below).
Examples:

GET /fhir/Patient/$PATIENT_ID
GET /fhir/Coverage?patient=$PATIENT_ID

## Authentication
The Flexpa API uses API keys and Access Tokens to authenticate requests. You obtain a Patient Access Token as the last step of the Flexpa Link auth flow.

Authentication to the per-patient FHIR Resources is performed via bearer auth.

Submit an Authorization header with a value of Bearer ${PAT} where ${PAT} is a currently valid Patient Access Token.
