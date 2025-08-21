import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { IUserRequest, ApiResponse } from '../types';

export const authenticateToken = async (
  req: IUserRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    req.user = user.toObject();
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user.toObject();
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we continue even if token is invalid
    next();
  }
};
