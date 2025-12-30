import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, TouchableOpacity, View, Modal, Platform, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { BlurView } from 'expo-blur';



import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { getProfile, updateProfile, PatientProfileDTO } from '@/src/api/patient';

export default function PatientProfile() {
    const { signOut, user } = useAuth();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [fullProfile, setFullProfile] = useState<PatientProfileDTO | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        loadProfileImage();
    }, []);

    const loadProfileImage = async () => {
        try {
            const data = await getProfile();
            setFullProfile(data);
            if (data.profileImage) {
                setProfileImage(data.profileImage);
            }
        } catch (error) {
            console.log('Error loading profile image:', error);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setProfileImage(base64Img);
            saveImage(base64Img);
        }
    };

    const saveImage = async (base64Img: string) => {
        if (!fullProfile) return;
        try {
            // Create updated profile object with new image
            const updatedProfile = { ...fullProfile, profileImage: base64Img };

            // We need to send ALL required fields. Assuming fullProfile has them from getProfile()
            // However, getProfile might return nulls where we expect strings.
            // Let's ensure we sending valid data structure expected by backend

            await updateProfile(updatedProfile);
            // alert('Profile picture updated!'); 
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
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
                <Text className="text-xl font-bold text-gray-900">My Profile</Text>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center mt-6 px-4 mb-8 gap-6">
                    {/* Profile Image Column (Left) */}
                    <View className="relative">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="w-28 h-28 rounded-full bg-white shadow-lg border-2 border-white overflow-hidden"
                        >
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="w-full h-full bg-blue-50 justify-center items-center">
                                    <Ionicons name="person" size={50} color="#CBD5E1" />
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full border-2 border-white justify-center items-center shadow-md"
                        >
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Details Column (Right) */}
                    <View className="flex-1">
                        <Text className="text-gray-500 text-sm font-medium tracking-wide mb-1 uppercase">Welcome</Text>
                        <Text className="text-2xl font-bold text-gray-900 leading-tight mb-1" numberOfLines={2}>
                            {user?.name || 'User'}
                        </Text>

                        <View className="flex-row items-center mb-2">
                            <View className="bg-emerald-100 px-2 py-0.5 rounded-md flex-row items-center self-start">
                                <Ionicons name="shield-checkmark" size={12} color="#059669" />
                                <Text className="text-emerald-700 text-xs font-semibold ml-1">Verified Patient</Text>
                            </View>
                        </View>

                        <Text className="text-gray-400 text-xs font-semibold tracking-widest uppercase">
                            ID: {user?.healthId || user?.id || '####'}
                        </Text>
                    </View>
                </View>

                {/* Quick Stats Row (Placeholder Data for Visual Density) */}
                {/* Quick Stats Row */}
                <View className="flex-row justify-between bg-blue-50 p-4 rounded-2xl mb-8 mx-2">
                    <View className="items-center flex-1 border-r border-blue-100">
                        <Text className="text-blue-900 font-bold text-lg">{fullProfile?.dob ? new Date().getFullYear() - new Date(fullProfile.dob).getFullYear() : '--'}</Text>
                        <Text className="text-blue-400 text-xs uppercase font-semibold">Age</Text>
                    </View>
                    <View className="items-center flex-1 border-r border-blue-100">
                        <Text className="text-blue-900 font-bold text-lg">{fullProfile?.bloodGroup || '--'}</Text>
                        <Text className="text-blue-400 text-xs uppercase font-semibold">Blood</Text>
                    </View>
                    <View className="items-center flex-1 border-r border-blue-100">
                        <Text className="text-blue-900 font-bold text-lg">{fullProfile?.height || '--'}</Text>
                        <Text className="text-blue-400 text-xs uppercase font-semibold">Height</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-blue-900 font-bold text-lg">{fullProfile?.weight || '--'}</Text>
                        <Text className="text-blue-400 text-xs uppercase font-semibold">Weight</Text>
                    </View>
                </View>

                {/* Settings / Actions */}
                <View className="space-y-6">
                    {/* Section: Account */}
                    <View>
                        <Text className="text-gray-900 font-bold text-lg mb-3 ml-2">Account Settings</Text>
                        <View className="space-y-3">
                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl"
                                onPress={() => router.push('/patient/personalInfo')}
                            >
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                                        <Ionicons name="person-outline" size={20} color="#374151" />
                                    </View>
                                    <Text className="ml-4 text-gray-700 font-medium">Personal Information</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl"
                                onPress={() => router.push('/patient/changePassword')}
                            >
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                                        <Ionicons name="lock-closed-outline" size={20} color="#374151" />
                                    </View>
                                    <Text className="ml-4 text-gray-700 font-medium">Change Password</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Section: Support */}
                    <View>
                        <Text className="text-gray-900 font-bold text-lg mb-3 ml-2">Support</Text>
                        <View className="space-y-3">
                            <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                                        <Ionicons name="help-buoy-outline" size={20} color="#374151" />
                                    </View>
                                    <Text className="ml-4 text-gray-700 font-medium">Help & Support</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                                        <Ionicons name="document-text-outline" size={20} color="#374151" />
                                    </View>
                                    <Text className="ml-4 text-gray-700 font-medium">Privacy Policy</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={() => setShowLogoutModal(true)}
                    className="mt-8 mb-8 flex-row items-center justify-center p-4 bg-red-50 rounded-xl border border-red-100"
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text className="ml-2 text-red-600 font-semibold font-lg">Log Out</Text>
                </TouchableOpacity>

                {/* Logout Confirmation Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showLogoutModal}
                    onRequestClose={() => setShowLogoutModal(false)}
                >
                    <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <BlurView
                            intensity={Platform.OS === 'ios' ? 20 : 50}
                            tint="dark"
                            style={StyleSheet.absoluteFill}
                        />

                        <View className="bg-white w-full max-w-[320px] p-6 rounded-3xl items-center shadow-2xl">
                            <View className="bg-red-100 p-4 rounded-full mb-4">
                                <Ionicons name="log-out" size={32} color="#EF4444" />
                            </View>

                            <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                                Log Out
                            </Text>

                            <Text className="text-base text-gray-500 text-center mb-8 px-2">
                                Are you sure you want to sign out of your account?
                            </Text>

                            <View className="flex-row gap-4 w-full">
                                <TouchableOpacity
                                    onPress={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gray-100 items-center active:bg-gray-200"
                                >
                                    <Text className="text-gray-700 font-semibold text-base">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setShowLogoutModal(false);
                                        signOut();
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-500 items-center active:bg-red-600"
                                >
                                    <Text className="text-white font-semibold text-base">Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
