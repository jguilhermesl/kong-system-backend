import { NextFunction, Request, Response } from 'express';
import { env } from '../env';
import { verify } from 'jsonwebtoken'

export function authMiddleware(req: any, res: any, next: any) {
  const authToken: string = req.headers.authorization as string || req.headers['Authorization'] as string;
  const JWT = env.JWT_SECRET;

  if (!authToken)
    return res.status(401).json({
      error: "Unauthorized."
    })

  const [, token] = authToken.split(' ')

  if (JWT) {
    verify(token, JWT, (error, decoded) => {
      if (error) return res.status(401).json({ error })

      req.userState = decoded as any
      return next();
    })
  }
}