import { Router } from 'express';
import { WalletController } from '../controllers/walletController';
import { authenticateToken } from '../middleware/auth';
import { 
  sendMoneyValidation, 
  exchangeRateValidation, 
  walletIdValidation 
} from '../middleware/validation';

const router = Router();
const walletController = new WalletController();

/**
 * @route   GET /api/wallet/wallets
 * @desc    Get user's wallets
 * @access  Private
 */
router.get('/wallets', authenticateToken, walletController.getWallets);

/**
 * @route   GET /api/wallet/transactions
 * @desc    Get all user's transactions
 * @access  Private
 */
router.get('/transactions', authenticateToken, walletController.getTransactions);

/**
 * @route   GET /api/wallet/transactions/:walletId
 * @desc    Get wallet-specific transactions
 * @access  Private
 */
router.get('/transactions/:walletId', authenticateToken, walletIdValidation, walletController.getTransactions);

/**
 * @route   GET /api/wallet/exchange-rates
 * @desc    Get exchange rates
 * @access  Public
 */
router.get('/exchange-rates', exchangeRateValidation, walletController.getExchangeRates);

/**
 * @route   GET /api/wallet/beneficiaries
 * @desc    Get user's beneficiaries
 * @access  Private
 */
router.get('/beneficiaries', authenticateToken, walletController.getBeneficiaries);

/**
 * @route   POST /api/wallet/send-money
 * @desc    Send money to beneficiary
 * @access  Private
 */
router.post('/send-money', authenticateToken, sendMoneyValidation, walletController.sendMoney);

/**
 * @route   GET /api/wallet/test-nium-connection
 * @desc    Test Nium API connection
 * @access  Private
 */
router.get('/test-nium-connection', authenticateToken, walletController.testNiumConnection);

/**
 * @route   POST /api/wallet/create-nium-customer
 * @desc    Create Nium customer profile for user
 * @access  Private
 */
router.post('/create-nium-customer', authenticateToken, walletController.createNiumCustomer);

/**
 * @route   GET /api/wallet/debug-config
 * @desc    Debug Nium API configuration
 * @access  Private
 */
router.get('/debug-config', authenticateToken, walletController.debugConfig);

export { router as walletRoutes };
