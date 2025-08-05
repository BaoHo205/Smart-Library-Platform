export interface IUser {
  id: string;           
  username: string;     
  password: string;     
  first_name: string;   
  last_name: string;      
  email: string;        
  role: UserRole;       
  created_at: Date;     
  updated_at: Date;     
}

export interface IRegistrationData {
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;      
}

// export interface IUserUpdate {
//   username?: string;    
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   role?: UserRole;
// }

// export interface IUserResponse extends Omit<IUser, 'password'> {}

export enum UserRole {
  ADMIN = 'admin',       
  USER = 'user',         
}

export interface ILoginData {
    username: string;
    password: string;
}

// export interface IJWTPayload {
//     userId: string;
//     issuedAt?: number;
//     expiration?: number;
// }

// export interface IApiResponse<T = any> {
//     success: boolean;
//     message: string;
//     data?: T;
//     errors?: any[];
//     pagination?: IPagination;
// }

// export interface IPagination {
//   page: number;          
//   limit: number;         
//   total: number;         
//   totalPages: number;    
// }

// export interface IChangePassword {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// // Extend Express Request type to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUser;        // Add user property to req object
//     }
//   }
// }