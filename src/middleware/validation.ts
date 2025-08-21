import { body, param, query } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters and spaces'),
  
  body('phoneNumber')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 characters')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters and spaces'),
  
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

export const sendMoneyValidation = [
  body('beneficiaryHashId')
    .notEmpty()
    .withMessage('Beneficiary ID is required'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0.01'),
  
  body('sourceCurrencyCode')
    .isLength({ min: 3, max: 3 })
    .withMessage('Source currency code must be 3 characters')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency code must be uppercase letters only'),
  
  body('destinationCurrencyCode')
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination currency code must be 3 characters')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency code must be uppercase letters only'),
  
  body('purpose')
    .notEmpty()
    .withMessage('Purpose is required')
    .isLength({ max: 100 })
    .withMessage('Purpose must not exceed 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters')
];

export const exchangeRateValidation = [
  query('from')
    .isLength({ min: 3, max: 3 })
    .withMessage('Source currency must be 3 characters')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency code must be uppercase letters only'),
  
  query('to')
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination currency must be 3 characters')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency code must be uppercase letters only')
];

export const walletIdValidation = [
  param('walletId')
    .optional()
    .isAlphanumeric()
    .withMessage('Wallet ID must be alphanumeric')
];
