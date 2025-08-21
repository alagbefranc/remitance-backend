import { Request } from 'express';

export interface IUser {
  _id?: any;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  niumCustomerHashId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRequest extends Request {
  user?: IUser;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Nium API Types
export interface NiumCustomer {
  customerHashId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    addressLine1: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface NiumWallet {
  walletHashId: string;
  currencyCode: string;
  balance: number;
  availableBalance: number;
  blockedBalance: number;
}

export interface NiumTransaction {
  transactionId: string;
  amount: number;
  currencyCode: string;
  type: 'CREDIT' | 'DEBIT';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  description: string;
  createdAt: string;
  beneficiaryName?: string;
}

export interface NiumBeneficiary {
  beneficiaryHashId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  bankAccountNumber: string;
  bankName: string;
  bankCode: string;
  country: string;
}

export interface NiumExchangeRate {
  sourceCurrencyCode: string;
  destinationCurrencyCode: string;
  exchangeRate: number;
  inverseExchangeRate: number;
  timestamp: string;
}

export interface SendMoneyRequest {
  beneficiaryHashId: string;
  amount: number;
  sourceCurrencyCode: string;
  destinationCurrencyCode: string;
  purpose: string;
  description?: string;
}
