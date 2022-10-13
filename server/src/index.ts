import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/flexpa_api_token.js';
import 'dotenv/config';
const app = express();

/*  The server and front-end server run on different origins (localhost:3000 and localhost:9000 respectively).
    Without CORS handling, the browser will not allow the frontend to make requests to the backend.
    Use the `cors()` to inject `Access-Control-Allow-Origin: *` header to preflight requests.
    In a production environment it's important to handle this more intelligently (see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
*/
app.use(cors());

// pre-parse the JSON body when appropriate
app.use(bodyParser.json());
app.use("", routes);


app.listen(process.env.PORT, 'localhost', () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

