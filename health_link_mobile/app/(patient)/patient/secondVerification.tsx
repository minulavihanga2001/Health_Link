import { API_URL } from '@/src/api/auth';
import { useAuth } from '@/src/context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

export default function PatientSecondVerification() {
    const { signOut, user, token } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Form State
    const [nic, setNic] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');

    const handleLogout = async () => {
        await signOut();
        router.replace('/login');
    };

    // Extract details from NIC
    const extractNicDetails = (nicString: string) => {
        let year = 0;
        let dayText = 0;
        let derivedGender = '';


        const cleanNic = nicString.trim().toUpperCase();


        const oldNicRegex = /^[0-9]{9}[VX]$/;

        const newNicRegex = /^[0-9]{12}$/;

        if (oldNicRegex.test(cleanNic)) {
            year = 1900 + parseInt(cleanNic.substring(0, 2));
            dayText = parseInt(cleanNic.substring(2, 5));
        } else if (newNicRegex.test(cleanNic)) {
            year = parseInt(cleanNic.substring(0, 4));
            dayText = parseInt(cleanNic.substring(4, 7));
        } else {
            return null;
        }

        // Determine Gender
        if (dayText > 500) {
            derivedGender = 'Female';
        } else {
            derivedGender = 'Male';
        }

        return { year, derivedGender };
    };

    // Pure Validation Helper
    const getValidationError = (currentNic: string, currentGender: string, currentDob: string) => {
        if (!currentNic) return null;

        const details = extractNicDetails(currentNic);

        // 1. NIC Format
        if (!details) {
            if (currentNic.length > 0) return 'Invalid NIC format.';
            return null;
        }

        // 2. Gender Match
        if (currentGender && currentGender !== details.derivedGender) {
            return `NIC indicates ${details.derivedGender}. Please check Gender.`;
        }

        // 3. DOB Year Match
        if (currentDob.length >= 4) {
            const dobYear = parseInt(currentDob.substring(0, 4));
            if (!isNaN(dobYear) && dobYear !== details.year) {
                return `NIC indicates year ${details.year}. Check DOB.`;
            }
        }
        return null;
    };

    // Real-time Validation Function (Uses current state for onBlur)
    const validateRealTime = () => {
        const validationError = getValidationError(nic, gender, dob);
        if (validationError) {
            setError(validationError);
        } else {
            setError('');
        }
    };

    const handleCompleteProfile = async () => {
        setError('');

        if (!nic.trim() || !mobileNumber.trim() || !dob.trim() || !address.trim() || !gender) {
            setError('Please fill in all fields to complete your profile.');
            return;
        }

        const validationError = getValidationError(nic, gender, dob);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${API_URL}/patient/complete-profile`,
                { nic, mobileNumber, dob, gender, address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Profile completed! Welcome to HealthLink.');
            router.replace('/patient/dashboard' as any);
        } catch (error: any) {
            console.error('Profile Update Error:', error);
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
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
                    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 18 }}>

                        <View className="items-center">
                            <Image
                                source={require('@/assets/images/full_logo.png')}
                                style={{ width: 220, height: 140 }}
                                resizeMode="contain"
                            />
                        </View>

                        <View className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                            <Text className="text-3xl font-semibold text-gray-900 mb-2 text-center">
                                Patient Verification
                            </Text>
                            <Text className="text-gray-500 text-center mb-8">
                                Welcome, <Text className="font-semibold text-[#1976D2]">{user?.name}</Text>!{'\n'}
                                Please complete your profile to continue.
                            </Text>


                            {error ? (
                                <View className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                                    <Text className="text-red-700 font-medium">{error}</Text>
                                </View>
                            ) : null}


                            <View className="space-y-4">
                                <View>
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">National ID (NIC)</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 mb-4"
                                        placeholder="Enter your NIC number"
                                        value={nic}
                                        onChangeText={(text) => {
                                            setNic(text);
                                            setError('');
                                        }}
                                        onBlur={validateRealTime}
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Mobile Number</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 mb-4"
                                        placeholder="e.g. +94 7X XXX XXXX"
                                        value={mobileNumber}
                                        onChangeText={(text) => {
                                            setMobileNumber(text);
                                            setError('');
                                        }}
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Date of Birth</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(true)}
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4"
                                    >
                                        <Text className={dob ? 'text-gray-800' : 'text-gray-400'}>
                                            {dob || 'Select Date of Birth'}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={dob ? new Date(dob) : new Date(2000, 0, 1)}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                if (selectedDate) {
                                                    const formattedDate = selectedDate.toISOString().split('T')[0];
                                                    setDob(formattedDate);

                                                    // Validate immediately
                                                    const validationError = getValidationError(nic, gender, formattedDate);
                                                    if (validationError) setError(validationError);
                                                    else setError('');
                                                }
                                            }}
                                            maximumDate={new Date()}
                                        />
                                    )}
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Gender</Text>
                                    <View className="flex-row space-x-4 mb-4">
                                        {['Male', 'Female'].map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                onPress={() => {
                                                    setGender(option);
                                                    const validationError = getValidationError(nic, option, dob);
                                                    if (validationError) setError(validationError);
                                                    else setError('');
                                                }}
                                                className={`flex-1 py-3 mr-2 rounded-xl border ${gender === option ? 'bg-blue-50 border-[#1976D2]' : 'bg-gray-50 border-gray-200'}`}
                                            >
                                                <Text className={`text-center font-medium ${gender === option ? 'text-[#1976D2]' : 'text-gray-600'}`}>
                                                    {option}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-medium mb-1 ml-1">Address</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                                        placeholder="Enter your specific address"
                                        value={address}
                                        onChangeText={(text) => {
                                            setAddress(text);
                                            setError('');
                                        }}
                                        multiline
                                        numberOfLines={3}
                                        style={{ height: 80, textAlignVertical: 'top' }}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleCompleteProfile}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl mt-8 shadow-md ${loading ? 'bg-blue-400' : 'bg-[#1976D2]'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white text-lg font-bold text-center">Verify & Continue</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="mt-6 self-center"
                        >
                            <Text className="text-gray-500 font-medium">Verify later? <Text className="text-red-500">Log Out</Text></Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
