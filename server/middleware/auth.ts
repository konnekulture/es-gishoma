
import { Request, Response, NextFunction } from 'express';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin token required' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Decode mock JWT
    const decoded = JSON.parse(atob(token));
    
    // Validate role and expiration
    if (decoded.role === 'admin' && decoded.exp > Date.now()) {
      (req as any).user = decoded;
      next();
    } else {
      res.status(403).json({ error: 'Invalid or expired admin credentials' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Failed to authenticate token' });
  }
};
