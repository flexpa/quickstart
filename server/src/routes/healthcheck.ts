import { Request, Response } from 'express';

export default function (_req: Request, res: Response) {
  console.log('Alive');
  res.send('ok');
}