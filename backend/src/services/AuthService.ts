import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { IRegistrationData, ILoginData, UserRole, IUser } from '../types/index';
import mysql from '../database/mysql/connection';
import jwtService from './JwtServices';

const register = async (registrationData: IRegistrationData) => {
  try {
    if (!registrationData.username) {
      throw new Error('Username are required');
    } else if (!registrationData.password) {
      throw new Error('Password is required');
    }

    const existingUser = (await mysql.executeQuery(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [registrationData.username, registrationData.email]
    )) as Array<IUser>;

    if (existingUser && existingUser.length > 0) {
      throw new Error('Username or email already exists');
    }

    if (!registrationData.role) {
      registrationData.role = UserRole.USER;
    } else if (!Object.values(UserRole).includes(registrationData.role)) {
      throw new Error('Invalid user role');
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(registrationData.password, 12);

    const createdAt = new Date();
    const updatedAt = new Date();

    const query = `
            INSERT INTO users (id, username, password, firstName, lastName, email, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    const params = [
      userId,
      registrationData.username,
      hashedPassword,
      registrationData.first_name,
      registrationData.last_name,
      registrationData.email,
      registrationData.role,
      createdAt,
      updatedAt,
    ];

    // Check if cannot execute 'INSERT' query later
    await mysql.executeQuery(query, params);
    return { message: 'User registered successfully', data: userId };
  } catch (error) {
    throw new Error(
      `${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const login = async (loginData: ILoginData) => {
  try {
    if (!loginData.username) {
      throw new Error('Username are required');
    } else if (!loginData.password) {
      throw new Error('Password is required');
    }

    const existingUser = (await mysql.executeQuery(
      'SELECT * FROM users WHERE username = ?',
      [loginData.username]
    )) as Array<{
      id: string;
      userName: string;
      password: string;
      role: UserRole;
    }>;

    if (!existingUser || existingUser.length === 0) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      existingUser[0].password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const isRoleValid = Object.values(UserRole).includes(existingUser[0].role);
    if (!isRoleValid) {
      throw new Error('Invalid user role');
    }

    const payload = {
      userId: existingUser[0].id,
      role: existingUser[0].role,
    };
    const accessToken = await jwtService.generateAccessToken(payload);
    const refreshToken = await jwtService.generateRefreshToken(payload);

    return {
      message: 'Login successful',
      data: {
        userId: existingUser[0].id,
        userName: existingUser[0].userName,
        role: existingUser[0].role,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    throw new Error(
      `${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const generateNewAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    const decoded = await jwtService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = await jwtService.generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    const newRefreshToken = await jwtService.generateRefreshToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return {
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        newRefreshToken,
        newAccessToken,
        userId: decoded.userId,
        role: decoded.role,
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default { register, login, generateNewAccessToken };
