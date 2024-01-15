import express, { Request, Response, Router } from "express";
import sql from "mssql";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  await sql.connect('Server=localhost,1433;Database=master;User Id=SA;Password=12345OHdf%e;TrustServerCertificate=True');
  const result = await sql.query`select * from patient`;

  res.send(result);
});

export default router;
