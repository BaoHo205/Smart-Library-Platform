import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../types';

interface Payload {
    userId: string;
    role: UserRole;
}

interface DecodedPayload {
    userId: string;
    role: UserRole;
    type: 'access' | 'refresh';
}


interface IJwtService {
    generateRefreshToken(payload: Payload): Promise<string>;
    generateAccessToken(payload: Payload): Promise<string>;
    verifyAccessToken(token: string): Promise<DecodedPayload>;
    verifyRefreshToken(token: string): Promise<DecodedPayload>;
    //refreshAccessToken(refreshToken: string): Promise<string>;
}

class JwtService implements IJwtService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;


    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

        if (!this.accessTokenSecret || !this.refreshTokenSecret) {
            throw new Error('JWT secrets are not configured properly in environment variables');
        }
    }

    public async generateRefreshToken(payload: Payload): Promise<string> {
        try {
            if (!payload || !payload.role) {
                throw new Error('Invalid payload for token generation');
            }

            const refreshToken = jwt.sign(
                {
                    userId: payload.userId,
                    role: payload.role,
                    type: 'refresh'
                },
                this.refreshTokenSecret,
                { expiresIn: '7d' }
            );
            return refreshToken;
        } catch (error) {
            throw new Error(`Failed to generate tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async generateAccessToken(payload: Payload): Promise<string> {
        try {
            if (!payload || !payload.role) {
                throw new Error('Invalid payload for token generation');
            }
            const accessToken = jwt.sign(
                {
                    userId: payload.userId,
                    role: payload.role,
                    type: 'access'
                },
                this.accessTokenSecret,
                { expiresIn: '30m' }
            );

            return accessToken;
        } catch (error) {
            throw new Error(`Failed to generate tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async verifyAccessToken(token: string): Promise<DecodedPayload> {
        try {
            if (!token) {
                throw new Error('No access token provided');
            }

            const decoded = jwt.verify(token, this.accessTokenSecret) as DecodedPayload;

            if (decoded.type !== 'access') {
                throw new Error('Invalid token type');
            }
            console.log(decoded);
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Access token expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid access token');
            }
            throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    public async verifyRefreshToken(token: string): Promise<DecodedPayload> {
        try {
            if (!token) {
                throw new Error('No refresh token provided');
            }

            const decoded = jwt.verify(token, this.refreshTokenSecret) as DecodedPayload;

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type in refresh token');
            }

            if (!Object.values(UserRole).includes(decoded.role)) {
                throw new Error('Invalid user role in refresh token');
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Refresh token expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid refresh token');
            }
            throw error;
        }
    }

    // public async refreshAccessToken(refreshToken: string): Promise<string> {
    //     try {
    //         const { userId } = await this.verifyRefreshToken(refreshToken);

    //         // TODO: Fetch user data from database using userId
    //         // For now, we'll indicate this needs database integration
    //         throw new Error('Refresh token implementation requires database integration - will implement in next step');

    //     } catch (error) {
    //         throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    //     }
    // }

}

export default new JwtService();
