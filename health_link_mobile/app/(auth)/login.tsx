import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const logo = require("../../assets/full_logo.png");
const googleIcon = require("../../assets/google_icon.png");

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loginPayload = {
        email: email.trim().toLowerCase(),
        password
      };

      await signIn(loginPayload);

    } catch (err: any) {
      console.log('Login Error:', err);
      let errorMessage = 'Login failed. Please check your credentials and try again.';

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = 'Invalid email or password.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    
    console.log('Forgot password clicked');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <TouchableOpacity
            onPress={() => router.push('/')}
            activeOpacity={0.7}
            className="active:scale-95 transition-all"
          >
            <View className="items-start mt-12 mb-6 ml-[-40px]">
              <Image
                source={logo}
                style={{ width: 300, height: 140 }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-600 mt-2">
              Sign in to access your medical records
            </Text>
          </View>

          
          {error ? (
            <View className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <Text className="text-red-700 font-medium">{error}</Text>
            </View>
          ) : null}

          
          <View className="space-y-4">
            
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Email Address</Text>
              <TextInput
                className="p-4 border border-gray-300 rounded-xl text-base bg-gray-50"
                placeholder="your.email@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                editable={!loading}
              />
            </View>
           
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-semibold">Password</Text>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  <Text className="text-[#1976D2] text-sm font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="relative">
                <TextInput
                  className="p-4 border border-gray-300 rounded-xl text-base bg-gray-50"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                  disabled={loading}
                >
                  <Text className="text-2xl">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              className={`py-5 rounded-xl mt-6 ${loading ? 'bg-blue-400' : 'bg-[#1976D2]'
                }`}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-white text-lg font-bold ml-2">
                    Signing In...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-xl font-bold text-center">
                  Log In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="text-gray-500 px-4">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

        
          <View className="space-y-3">
            <TouchableOpacity
              className="py-4 border-2 border-gray-300 rounded-xl flex-row justify-center items-center"
              disabled={loading}
              activeOpacity={0.7}
            >
              <Image
                source={googleIcon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text className="text-gray-700 font-semibold ml-3">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          
          <View className="mt-10 flex-row justify-center items-center">
            <Text className="text-gray-600 text-base">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              disabled={loading}
            >
              <Text className="text-[#1976D2] font-bold text-base underline">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

         
          <View className="mt-8 bg-blue-50 p-4 rounded-xl">
            <View className="flex-row items-start">
              <Text className="text-2xl mr-2">🔒</Text>
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-1">
                  Your data is secure
                </Text>
                <Text className="text-gray-600 text-sm">
                  We use industry-standard encryption to protect your medical records and personal information.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}