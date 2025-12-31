import client from './client';
// API_URL is now handled in client.ts via BASE_URL

export interface SignupReqDTO {
  name: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR' | 'PHARMACIST' | 'ADMIN';
}

export interface LoginReqDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  id: string;
  token: string;
  role: 'PATIENT' | 'DOCTOR' | 'PHARMACIST' | 'ADMIN';
  name: string;
  email: string;
  healthId: string;
  isActive: boolean;
  isVerificationComplete: boolean;
}

// --- API Calls ---

export const signup = async (data: SignupReqDTO): Promise<void> => {
  try {
    await client.post('/auth/signup', data);
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (email: string, code: string): Promise<AuthResponseDTO> => {
  try {
    const response = await client.post<AuthResponseDTO>('/auth/verify', { email, verificationCode: code });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const resendOtp = async (email: string): Promise<void> => {
  try {
    await client.post('/auth/resend-otp', { email });
  } catch (error) {
    throw error;
  }
}

export const login = async (data: LoginReqDTO): Promise<AuthResponseDTO> => {
  try {
    const response = await client.post<AuthResponseDTO>('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface ChangePasswordReqDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const changePassword = async (data: ChangePasswordReqDTO) => {
  try {
    const response = await client.post('/auth/change-password', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        throw new Error(error.response.data);
      }
      throw new Error(error.response.data.message || 'Failed to change password');
    }
    throw new Error('Network error or server not reachable');
  }
};