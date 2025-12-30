import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { changePassword } from '@/src/api/auth';
import { StatusBar } from 'expo-status-bar';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            if (user?.email) {
                await changePassword({
                    email: user.email!,
                    oldPassword,
                    newPassword
                });

                Alert.alert('Success', 'Password changed successfully. Please login again.', [
                    { text: 'OK', onPress: () => signOut() }
                ]);
            } else {
                Alert.alert('Error', 'User email not found');
            }
        } catch (error: any) {
            Alert.alert('Failed', error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Change Password</Text>
            </View>

            <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
                <Text className="text-gray-500 mb-6">
                    Create a new, strong password that you don't use for other websites.
                </Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 font-medium mb-2 ml-1">Current Password</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 mb-4"
                            placeholder="Enter current password"
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 font-medium mb-2 ml-1">New Password</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 mb-4"
                            placeholder="Enter new password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 font-medium mb-2 ml-1">Confirm New Password</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
                            placeholder="Re-enter new password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleChangePassword}
                    className={`mt-8 bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200 ${isLoading ? 'opacity-70' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Update Password</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
