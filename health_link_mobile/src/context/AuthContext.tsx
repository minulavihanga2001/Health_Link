import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponseDTO, LoginReqDTO, SignupReqDTO, login, signup } from '../api/auth';

// --- Types ---
interface User extends Omit<AuthResponseDTO, 'token'> { }

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (payload: LoginReqDTO) => Promise<void>;
  signUp: (payload: SignupReqDTO) => Promise<void>;
  signInWithToken: (response: AuthResponseDTO) => Promise<void>;
  signOut: () => Promise<void>;
}

// SecureStore Key for JWT storage
const TOKEN_KEY = 'healthlink_jwt';

// --- Context Creation ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load: Check for stored token on app start
  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          // In a real app, you'd validate the token against the backend here.
          // For now, we assume if the token exists, the user is logged in.
          setToken(storedToken);
          // Placeholder: Extract user info (role/id) from token payload for state
          // For simplicity, we just set a dummy user state:
          setUser({ id: 'dummy_id', name: 'User', email: 'dummy@email.com', role: 'PATIENT', isActive: true, isVerificationComplete: true, healthId: 'HL-PNT00' });
        }
      } catch (error) {
        console.error('Error loading token from SecureStore:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredToken();
  }, []);

  // 2. Sign In function
  const signIn = async (payload: LoginReqDTO) => {
    try {
      const response = await login(payload);
      console.log("DEBUG: AuthContext SignIn Response:", JSON.stringify(response, null, 2));

      // Store token securely
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);

      // Update state
      setToken(response.token);
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        isActive: response.isActive,
        isVerificationComplete: response.isVerificationComplete,
        healthId: response.healthId
      });

      // Navigate is handled by the hook below (useAuthRedirect)
    } catch (error) {
      // Re-throw error to be caught by the LoginScreen
      throw error;
    }
  };

  // 3. Sign Up function (Modified: No longer auto-logins)
  const signUp = async (payload: SignupReqDTO) => {
    try {
      await signup(payload);
      // No token set here. Navigation to verify screen happens in component.
    } catch (error) {
      throw error;
    }
  };

  // 4. Sign In With Token (New: Used after successful verification)
  const signInWithToken = async (response: AuthResponseDTO) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      setToken(response.token);
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        isActive: response.isActive,
        isVerificationComplete: response.isVerificationComplete,
        healthId: response.healthId
      });
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  };

  // 5. Sign Out function
  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signUp, signInWithToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook for consuming context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Custom Hook for Redirecting (Expo Router specific) ---
// This handles routing logic centrally based on auth state
export function useAuthRedirect() {
  const segments = useSegments();
  const { user, isLoading } = useAuth();
  const isAuthenticated = user !== null;

  useEffect(() => {
    if (isLoading) return; // Wait for initial state load

    const inAuthGroup = segments[0] === '(auth)';
    const inRoot = !segments[0];

    if (isAuthenticated) {
      // If user is authenticated, they should not be on Auth screens (Login/Signup) 
      // OR the Welcome screen (Root). Redirect them to their dashboard.
      // EXCEPTION: If they are on the 'verify' screen, we let the component handle the redirect
      // so that the success modal can be shown first.
      const isVerifyScreen = segments[0] === '(auth)' && segments[1] === 'verify';

      if ((inAuthGroup && !isVerifyScreen) || inRoot) {
        if (user.role === 'PATIENT') {
          if (user.isVerificationComplete) {
            router.replace('/patient/dashboard' as any);
          } else {
            router.replace('/patient/secondVerification' as any);
          }
        } else if (user.role === 'PHARMACIST') {
          router.replace('/pharmacist/welcome' as any);
        } else {
          // Fallback if role is unknown, though this shouldn't happen with valid users
          // Maybe stay on root if no role? But for now assuming valid roles.
        }
      }
    } else {
      // If user is NOT authenticated
      // They are allowed on Root (Welcome) and Auth Group (Login/Signup)
      // Any other route (Protected) should redirect them to Welcome (or Login).
      const isAllowed = inAuthGroup || inRoot;

      if (!isAllowed) {
        // User is trying to access a protected route without auth.
        // Redirect to Login page.
        router.replace('/login');
      }
    }
  }, [user, segments, isLoading]);
}