import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PharmacistWelcome() {
    const { signOut, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.replace('/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
            <StatusBar style="dark" />
            <Text className="text-3xl font-bold text-[#1976D2] mb-4">Welcome, Pharmacist!</Text>
            <Text className="text-lg text-gray-600 mb-8 text-center">
                Hello {user?.name}, your account is verified and ready.
            </Text>

            <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 py-3 px-8 rounded-full"
            >
                <Text className="text-white font-bold text-lg">Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
