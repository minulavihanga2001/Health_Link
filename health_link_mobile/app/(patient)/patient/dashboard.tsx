import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Image, Text, TouchableOpacity, View, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getProfile, PatientProfileDTO } from '@/src/api/patient';


const LOGO_img = require('../../../assets/logo_only.png');

export default function PatientDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [fullProfile, setFullProfile] = useState<PatientProfileDTO | null>(null);
    const [showQrModal, setShowQrModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchProfileData = async () => {
                try {
                    const data = await getProfile();
                    setFullProfile(data);
                } catch (error) {
                    console.log('Error fetching profile:', error);
                }
            };

            if (user) {
                fetchProfileData();
            }
        }, [user])
    );

    const qrData = `HEALTHLINK:PATIENT:${user?.healthId || user?.id}`;


    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-6">
            <StatusBar style="dark" />
            <View className="flex-row justify-between items-center mb-8">
                <View>
                    <Text className="text-gray-500 text-lg ml-2">Welcome back,</Text>
                    <Text className="text-3xl font-bold text-gray-900 ml-2">{user?.name || 'Patient'}</Text>
                </View>
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        className="bg-blue-400 p-3 rounded-full shadow-sm"
                        onPress={() => router.push('/scanner/scan')}
                    >
                        <Ionicons name="scan" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white p-3 rounded-full shadow-sm"
                        onPress={() => { }}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/patient/profile')}
                        className="bg-blue-50 p-1 rounded-full border border-blue-100 overflow-hidden w-12 h-12 justify-center items-center"
                    >
                        {fullProfile?.profileImage ? (
                            <Image
                                source={{ uri: fullProfile.profileImage }}
                                className="w-full h-full rounded-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="person-outline" size={24} color="#1976D2" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Health ID Card */}
            <LinearGradient
                colors={['#1e3a8a', '#10b981']} // Blue-900 to Emerald-500
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="shadow-lg shadow-blue-900 mb-6"
                style={{ borderRadius: 24, overflow: 'hidden', padding: 24 }}
            >
                {/* Header: Logo & Verified Badge */}
                <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-row items-center gap-2">
                        <Image source={LOGO_img} style={{ width: 30, height: 30 }} resizeMode="contain" />
                        <Text className="text-white font-bold text-lg tracking-wider">HealthLink</Text>
                    </View>
                    <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                        <Ionicons name="shield-checkmark" size={16} color="#ffffff" />
                        <Text className="text-white ml-1 text-xs font-semibold">Verified</Text>
                    </View>
                </View>

                {/* Body: Details & QR */}
                <View className="flex-row justify-between items-end">
                    <View>
                        <View className="mb-4">
                            <Text className="text-blue-100 text-xs uppercase mb-1">Patient Name</Text>
                            <Text className="text-white text-xl font-bold">{user?.name || 'Unknown'}</Text>
                        </View>
                        <View>
                            <Text className="text-blue-100 text-xs uppercase mb-1">Patient ID</Text>
                            <Text className="text-white text-base font-semibold tracking-widest">{user?.healthId || user?.id || '####'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-white p-2 rounded-xl"
                        onPress={() => setShowQrModal(true)}
                    >
                        <QRCode
                            value={qrData}
                            size={70}
                            color="black"
                            backgroundColor="white"
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-400">Dashboard Content Coming Soon...</Text>
            </View>

            {/* Enlarged QR Modal */}
            <Modal
                visible={showQrModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowQrModal(false)}
            >
                <BlurView intensity={90} tint="dark" className="flex-1 justify-center items-center p-6">
                    <TouchableOpacity
                        className="absolute inset-0"
                        onPress={() => setShowQrModal(false)}
                    />

                    <View className="bg-white p-8 rounded-3xl items-center shadow-2xl w-full max-w-sm">
                        <Text className="text-xl font-bold text-gray-900 mb-2">My Health ID</Text>
                        <Text className="text-gray-500 mb-6 font-medium tracking-widest uppercase">{user?.healthId || user?.id || '####'}</Text>

                        <View className="p-2 border-4 border-gray-100 rounded-xl mb-6">
                            <QRCode
                                value={qrData}
                                size={220}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>

                        <Text className="text-center text-gray-400 text-xs px-4">
                            Scan this code at the hospital or pharmacy to access your records instantly.
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowQrModal(false)}
                            className="mt-8 bg-gray-100 px-6 py-3 rounded-full"
                        >
                            <Text className="text-gray-600 font-semibold">Close</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>
        </SafeAreaView>
    );
}
