import { Request, Response } from 'express';
import authService from '../services/AuthService';

const register = async (req: Request, res: Response) => {
  try {
    const registrationData = req.body;

    const result = await authService.register(registrationData);
    if (result) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const loginData = req.body;

    const result = await authService.login(loginData);
    if (result) {
      res.cookie('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', result.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data.accessToken,
      });
    } else {
      res.status(401).json({
        success: false,
        message: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const generateNewAccessToken = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    const refreshToken = cookies.refreshToken;
    const accessToken = await authService.generateNewAccessToken(refreshToken);
    console.log(accessToken);
    if (accessToken) {
      res.cookie('accessToken', accessToken.data, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: accessToken.message,
        data: accessToken.data,
      });
    } else {
      res.status(401).json({
        success: false,
        message: accessToken,
      });
      console.error('Failed to refresh access token:', accessToken);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    console.error('Error during access token refresh:', error);
  }
};
const logout = async (req: Request, res: Response) => {
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
