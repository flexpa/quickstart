import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import flexpaAccessToken from "./routes/flexpa_access_token";
import fhirRouter from "./routes/fhir";
import "dotenv/config";

const app = express();

/*  The frontend and backend servers run on different origins (localhost:3000 and localhost:9000 respectively).
    Without CORS handling, the browser will not allow the frontend to make requests to the backend.
    Use `cors()` to inject `Access-Control-Allow-Origin: *` header to preflight requests.
    In a production environment it's important to handle this intentionally (see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
*/
app.use(cors());

// pre-parse the JSON body when appropriate
app.use(bodyParser.json());
app.use("/flexpa-access-token", flexpaAccessToken);
app.use("/fhir", fhirRouter);

app.listen(9000, "0.0.0.0", () => {
  console.log("Server listening on http://localhost:9000");
});
