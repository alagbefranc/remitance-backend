import { Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { niumService } from '../services/niumService';
import { IUserRequest, ApiResponse, AuthTokens } from '../types';

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: IUserRequest, res: Response<ApiResponse<{ user: any; tokens: AuthTokens }>>): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: errors.array().map(err => err.msg).join(', ')
        });
        return;
      }

      const { email, password, firstName, lastName, phoneNumber } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
        return;
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        phoneNumber,
        isEmailVerified: false
      });

      await user.save();

      // Try to create Nium customer (optional for now)
      try {
        const niumCustomer = await niumService.createCustomer(user.toObject());
        user.niumCustomerHashId = niumCustomer.customerHashId;
        await user.save();
        console.log('✅ Nium customer created:', niumCustomer.customerHashId);
      } catch (error) {
        console.warn('⚠️ Failed to create Nium customer, continuing without:', error);
      }

      // Generate JWT token
      const accessToken = generateToken(user.toObject());

      // Remove password from response
      const userResponse = user.toJSON();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          tokens: { accessToken }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Login user
   */
  async login(req: IUserRequest, res: Response<ApiResponse<{ user: any; tokens: AuthTokens }>>): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: errors.array().map(err => err.msg).join(', ')
        });
        return;
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // If user doesn't have Nium customer, try to create one
      if (!user.niumCustomerHashId) {
        try {
          const niumCustomer = await niumService.createCustomer(user.toObject());
          user.niumCustomerHashId = niumCustomer.customerHashId;
          await user.save();
          console.log('✅ Nium customer created on login:', niumCustomer.customerHashId);
        } catch (error) {
          console.warn('⚠️ Failed to create Nium customer on login:', error);
        }
      }

      // Generate JWT token
      const accessToken = generateToken(user.toObject());

      // Remove password from response
      const userResponse = user.toJSON();

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          tokens: { accessToken }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: IUserRequest, res: Response<ApiResponse<any>>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user.toJSON()
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: IUserRequest, res: Response<ApiResponse<any>>): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { firstName, lastName, phoneNumber } = req.body;
      
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Update fields if provided
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user.toJSON()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
