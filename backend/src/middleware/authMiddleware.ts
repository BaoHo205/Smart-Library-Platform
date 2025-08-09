import { Request, Response, NextFunction } from 'express';
import jwtService from '../services/JwtServices';
import { UserRole } from '../types';

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await jwtService.verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
    req.body.userId = payload.userId;
    req.body.userRole = payload.role;

    next();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Access token expired') {
        return res.status(401).json({ message: 'Access token expired' });
      }

      if (
        err.message === 'Invalid access token' ||
        err.message === 'Invalid token type'
      ) {
        return res.status(403).json({ message: 'Invalid access token' });
      }
    }

    console.error('Could not verify access token:', err);
    return res.status(500).json({ message: 'Could not verify access token' });
  }
};

const verifyRole = (requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.body.userRole;

    if (!userRole) {
      return res
        .status(401)
        .json({ message: 'User role not found. Please authenticate first.' });
    }

    if (!requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

const verifyStaff = verifyRole([UserRole.STAFF]);
const verifyUser = verifyRole([UserRole.USER]);
const verifyStaffOrUser = verifyRole([UserRole.STAFF, UserRole.USER]);

export default {
  verifyJWT,
  verifyStaff,
  verifyUser,
  verifyStaffOrUser,
};
