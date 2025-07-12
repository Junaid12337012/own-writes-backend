import { Request, Response, NextFunction } from 'express';

export const cacheControl = (req: Request, res: Response, next: NextFunction) => {
  // Force no caching for ALL requests
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.header('Surrogate-Control', 'no-store');
  
  next();
};
