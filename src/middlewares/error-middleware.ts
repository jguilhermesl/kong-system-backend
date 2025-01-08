import { Response } from 'express';

export const errorMiddleware = (
  err: Error,
  res: Response,
) => res.status(400).json({ error: err.message });