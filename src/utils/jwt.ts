import jwt from 'jsonwebtoken';
import { IUser } from '../types';

export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: 'remittance-app',
    audience: 'remittance-app-users'
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  try {
    return jwt.verify(token, secret, {
      issuer: 'remittance-app',
      audience: 'remittance-app-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};
