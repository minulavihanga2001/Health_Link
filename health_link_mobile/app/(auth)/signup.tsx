import { SignupReqDTO } from '@/src/api/auth';
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

const ROLES = [
  { label: 'Patient', value: 'PATIENT', icon: '🏥' },
  { label: 'Pharmacist', value: 'PHARMACIST', icon: '💊' },
] as const;

type RoleValue = SignupReqDTO['role'];

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleValue>(ROLES[0].value as RoleValue);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const { signUp } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const router = useRouter();

  const handleSignup = async () => {

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {

      const signupPayload: SignupReqDTO = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole
      };

      await signUp(signupPayload);

      router.push({
        pathname: '/(auth)/verify',
        params: { email: email.trim().toLowerCase() }
      });

    } catch (err: any) {
      console.log('Signup Error Full Object:', JSON.stringify(err, null, 2));

      let errorMessage = 'An unexpected error occurred.';

      if (err.response) {

        console.log('Server Error Data:', err.response.data);
        console.log('Server Error Status:', err.response.status);

        if (err.response.status === 409 || err.response.status === 403) {
          errorMessage = 'This email is already registered. Please log in or use a different email.';
        } else if (err.response.status === 400 && typeof err.response.data === 'string' && err.response.data.includes('email')) {

          errorMessage = err.response.data;
        } else {
          errorMessage = err.response.data?.message || `Server Error (${err.response.status})`;
        }
      } else if (err.request) {

        console.log('Network Error - No response received:', err.request);
        errorMessage = 'Network Error. Could not connect to the server. Please ensure your computer and device are on the same Wi-Fi and the backend is running.';
      } else {

        console.log('Request Setup Error:', err.message);
        errorMessage = err.message || 'An error occurred while setting up the request.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
              Create Your Account
            </Text>
            <Text className="text-base text-gray-600 mt-2">
              Register as a Patient or Pharmacist to get started.
            </Text>
          </View>


          {error ? (
            <View className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <Text className="text-red-700 font-medium">{error}</Text>
            </View>
          ) : null}


          <View className="space-y-4">

            <View>
              <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
              <TextInput
                className="p-4 border border-gray-300 rounded-xl text-base bg-gray-50"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                editable={!loading}
              />
            </View>


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
              <Text className="text-gray-700 font-semibold mb-2">Password</Text>
              <TextInput
                className="p-4 border border-gray-300 rounded-xl text-base bg-gray-50"
                placeholder="Min. 8 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                editable={!loading}
              />
            </View>


            <View className="mt-2">
              <Text className="text-gray-700 font-semibold mb-3">Select Your Role</Text>
              <View className="flex-row gap-3">
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    onPress={() => setSelectedRole(role.value)}
                    className={`flex-1 py-4 px-4 rounded-xl border-2 ${selectedRole === role.value
                      ? 'border-[#1976D2] bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                      }`}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <Text className="text-2xl text-center mb-1">{role.icon}</Text>
                    <Text
                      className={`text-center font-bold ${selectedRole === role.value ? 'text-[#1976D2]' : 'text-gray-600'
                        }`}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>


            <TouchableOpacity
              onPress={handleSignup}
              className={`py-5 rounded-xl mt-6 ${loading ? 'bg-blue-400' : 'bg-[#1976D2]'
                }`}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-white text-lg font-bold ml-2">
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-xl font-bold text-center">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
          </View>


          <View className="mt-8 flex-row justify-center items-center">
            <Text className="text-gray-600 text-base font-semibold">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/login')}
              disabled={loading}
            >
              <Text className="text-[#1976D2] font-bold text-base underline">
                Log In
              </Text>
            </TouchableOpacity>
          </View>


          <Text className="text-center text-gray-500 text-sm mt-6 px-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}