import { CookieOptions, Request, Response } from 'express';
import authService from '../services/AuthService';

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false on localhost (HTTP), true in production (HTTPS)
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 60 * 1000, // 30 minutes
  path: '/',
};

const register = async (req: Request, res: Response) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register new user'
  // #swagger.description = 'Create a new user account with email and password'
  try {
    const registrationData = req.body;
    const result = await authService.register(registrationData);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: 'Registration failed' });
    }

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const login = async (req: Request, res: Response) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'User login'
  // #swagger.description = 'Authenticate user and return access and refresh tokens'
  try {
    const loginData = req.body;
    console.log('Login data:', loginData);
    const result = await authService.login(loginData);
    console.log(result);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Set cookies
    res.cookie('refreshToken', result.data.refreshToken, refreshCookieOptions);
    res.cookie('accessToken', result.data.accessToken, accessCookieOptions);

    // Return consistent shape
    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        id: result.data.userId,
        name: result.data.userName,
        role: result.data.role,
        accessToken: result.data.accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const generateNewAccessToken = async (req: Request, res: Response) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Refresh access token'
  // #swagger.description = 'Generate a new access token using refresh token'
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: 'No refresh token provided' });
    }

    const tokenResult = await authService.generateNewAccessToken(refreshToken);
    if (!tokenResult) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid refresh token' });
    }

    if (tokenResult.data.refreshToken) {
      res.cookie(
        'refreshToken',
        tokenResult.data.refreshToken,
        refreshCookieOptions
      );
    }

    res.cookie(
      'accessToken',
      tokenResult.data.newAccessToken,
      accessCookieOptions
    );
    return res.status(200).json({
      success: true,
      message: tokenResult.message,
      data: { accessToken: tokenResult.data.newAccessToken },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    console.error('Error during access token refresh:', error);
  }
};

const logout = async (req: Request, res: Response) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'User logout'
  // #swagger.description = 'Logout user and invalidate tokens'
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.sendStatus(204);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.sendStatus(204);
    console.log('User logged out successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    console.error('Error during access token refresh:', error);
  }
};

export default { register, login, logout, generateNewAccessToken };
