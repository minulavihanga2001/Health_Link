import axios from 'axios';

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

// --- Configuration ---
export const API_URL = 'http://192.168.8.162:8080/api/v1'; // Adjusted baseURL to match new API paths

const api = axios.create({ // Renamed authApi to api

  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// --- 4. API Calls ---

export const signup = async (data: SignupReqDTO): Promise<void> => {
  try {
    await api.post('/auth/signup', data); // Changed return type to void, removed response.data
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (email: string, code: string): Promise<AuthResponseDTO> => {
  try {
    const response = await api.post<AuthResponseDTO>('/auth/verify', { email, verificationCode: code });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const resendOtp = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/resend-otp', { email });
  } catch (error) {
    throw error;
  }
}

export const login = async (data: LoginReqDTO): Promise<AuthResponseDTO> => { // Changed payload to data
  try {
    const response = await api.post<AuthResponseDTO>('/auth/login', data);
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
    const response = await api.post('/auth/change-password', data);
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