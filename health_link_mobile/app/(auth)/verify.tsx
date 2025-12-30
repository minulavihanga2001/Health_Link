import { resendOtp, verifyUser } from '@/src/api/auth';
import VerificationSuccessModal from '@/src/components/VerificationSuccessModal';
import { useAuth } from '@/src/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const router = useRouter();
    const { signInWithToken } = useAuth();

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOtpChange = (text: string, index: number) => {
        if (text.length > 1) {
            const pastedCode = text.slice(0, 6).split('');
            const newOtp = [...otp];
            pastedCode.forEach((char, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = char;
                }
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + pastedCode.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) {
            setVerificationError('Please enter the full 6-digit code.');
            return;
        }
        setLoading(true);
        setVerificationError('');
        try {
            const authResponse = await verifyUser(email, code);
            await signInWithToken(authResponse);

            setUserRole(authResponse.role);
            setShowSuccessModal(true);
        } catch (err: any) {
            console.log('Verification Error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setVerificationError(err.response.data.message);
            } else {
                setVerificationError('Invalid verification code or server error.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setVerificationError('');
        try {
            await resendOtp(email);
            setTimer(120);
            setCanResend(false);
            setOtp(new Array(6).fill(''));
            inputRefs.current[0]?.focus();
            Alert.alert('Sent', 'A new verification code has been sent to your email.');
        } catch (err) {
            console.log('Resend Error:', err);
            setVerificationError('Failed to resend code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        if (userRole === 'PHARMACIST') {
            router.replace('/(pharmacist)/pharmacist/welcome' as any);
        } else {
            router.replace('/patient/secondVerification' as any);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-row items-center px-4 py-2">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm"
                        >
                            <MaterialIcons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                        <View className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 items-center">

                            <View className="mb-8">
                                <Image
                                    source={require('@/assets/images/full_logo.png')}
                                    style={{ width: 180, height: 60 }}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text className="text-2xl font-bold text-gray-900 mb-2">Verification Code</Text>
                            <Text className="text-gray-500 text-center mb-6">
                                Please enter the verification code sent to{'\n'}
                                <Text className="font-semibold text-gray-800">{email}</Text>
                            </Text>

                            <View className="flex-row justify-between w-full mb-8">
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => { inputRefs.current[index] = ref; }}
                                        className={`w-10 h-12 sm:w-12 sm:h-14 border-2 rounded-xl text-center text-xl font-bold shadow-sm ${digit
                                            ? 'border-[#1976D2] bg-blue-50 text-[#1976D2]'
                                            : 'border-gray-200 bg-white text-gray-800'
                                            }`}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={digit}
                                        onChangeText={(text) => handleOtpChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        selectTextOnFocus
                                        editable={!loading}
                                    />
                                ))}
                            </View>

                            {verificationError ? (
                                <View className="bg-red-50 p-3 rounded-xl mb-6 flex-row items-center w-full border border-red-100">
                                    <MaterialIcons name="error-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                                    <Text className="text-red-700 font-medium text-sm flex-1">{verificationError}</Text>
                                </View>
                            ) : null}

                            <TouchableOpacity
                                onPress={handleVerify}
                                className={`w-full py-4 rounded-xl mb-6 shadow-md ${loading ? 'bg-blue-400' : 'bg-[#1976D2]'}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white text-lg font-bold text-center">Verify Now</Text>
                                )}
                            </TouchableOpacity>

                            <View className="items-center w-full">
                                {canResend ? (
                                    <TouchableOpacity
                                        onPress={handleResend}
                                        disabled={loading}
                                        className="flex-row items-center py-2 px-4 rounded-lg active:bg-blue-50"
                                    >
                                        <MaterialIcons name="refresh" size={18} color="#1976D2" style={{ marginRight: 6 }} />
                                        <Text className="text-[#1976D2] text-base font-bold">Resend Code</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text className="text-gray-400 text-sm">
                                        Resend code in <Text className="font-bold text-[#1976D2]">{formatTime(timer)}</Text>
                                    </Text>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>


            <VerificationSuccessModal
                visible={showSuccessModal}
                onClose={handleModalClose}
            />
        </SafeAreaView >
    );
}
