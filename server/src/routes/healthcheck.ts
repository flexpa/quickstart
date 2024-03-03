import { Request, Response } from 'express';

export default function (_req: Request, res: Response) {

  res.send('ok');
}