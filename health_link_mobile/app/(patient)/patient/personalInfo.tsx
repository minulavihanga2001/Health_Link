import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getProfile, updateProfile, PatientProfileDTO } from '@/src/api/patient';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<PatientProfileDTO>({
        nic: '',
        mobileNumber: '',
        dob: '',
        gender: '',
        address: '',
        allergies: [],
        maritalStatus: '',
        guardianName: '',
        guardianContact: ''
    });

    const [allergyInput, setAllergyInput] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            // Map backend data to form state (handling potential nulls)
            setFormData({
                nic: data.nic || '',
                mobileNumber: data.mobileNumber || '',
                dob: data.dob || '',
                gender: data.gender || '',
                address: data.address || '',
                allergies: data.allergies || [],
                maritalStatus: data.maritalStatus || '',
                guardianName: data.guardianName || '',
                guardianContact: data.guardianContact || '',
                bloodGroup: data.bloodGroup || '',
                height: data.height || undefined,
                weight: data.weight || undefined
            });
        } catch (error) {
            console.error('Failed to load profile:', error);
            Alert.alert('Error', 'Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile(formData);
            Alert.alert('Success', 'Profile updated successfully!');
            router.back();
        } catch (error) {
            console.error('Failed to save profile:', error);
            Alert.alert('Error', 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const addAllergy = () => {
        if (allergyInput.trim()) {
            setFormData(prev => ({
                ...prev,
                allergies: [...prev.allergies, allergyInput.trim()]
            }));
            setAllergyInput('');
        }
    };

    const removeAllergy = (index: number) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#1976D2" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Personal Info</Text>
                </View>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color="#1976D2" />
                    ) : (
                        <Text className="text-blue-600 font-bold text-lg">Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>

                {/* Personal Details Section */}
                <Text className="text-lg font-bold text-green-600 mb-4">Basic Details</Text>

                <View className="space-y-6 mb-8">
                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">NIC</Text>
                        <TextInput
                            className="p-4 bg-gray-100 rounded-xl border border-gray-200 text-gray-500 mb-4"
                            value={formData.nic}
                            editable={false}
                            placeholder="National Identity Card"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">Mobile Number</Text>
                        <TextInput
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 mb-4"
                            value={formData.mobileNumber}
                            onChangeText={t => setFormData({ ...formData, mobileNumber: t })}
                            placeholder="Enter mobile number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 ml-1 font-medium">Date of Birth</Text>
                            <TextInput
                                className="p-4 bg-gray-100 rounded-xl border border-gray-200 text-gray-500 mb-4"
                                value={formData.dob}
                                editable={false}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 ml-1 font-medium">Gender</Text>
                            <TextInput
                                className="p-4 bg-gray-100 rounded-xl border border-gray-200 text-gray-500"
                                value={formData.gender}
                                editable={false}
                                placeholder="Gender"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">Marital Status</Text>
                        <TextInput
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 mb-4"
                            value={formData.maritalStatus}
                            onChangeText={t => setFormData({ ...formData, maritalStatus: t })}
                            placeholder="Single / Married"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">Address</Text>
                        <TextInput
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                            value={formData.address}
                            onChangeText={t => setFormData({ ...formData, address: t })}
                            placeholder="Home Address"
                            multiline
                        />
                    </View>
                </View>

                {/* Guardian Section */}
                <Text className="text-lg font-bold text-green-600 mb-4">Guardian Details</Text>
                <View className="space-y-6 mb-8">
                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">Guardian Name</Text>
                        <TextInput
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 mb-4"
                            value={formData.guardianName}
                            onChangeText={t => setFormData({ ...formData, guardianName: t })}
                            placeholder="Enter guardian name"
                        />
                    </View>
                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">Guardian Contact</Text>
                        <TextInput
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                            value={formData.guardianContact}
                            onChangeText={t => setFormData({ ...formData, guardianContact: t })}
                            placeholder="Enter guardian contact"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Health Metrics Section */}
                <Text className="text-lg font-bold text-green-600 mb-4">Health Metrics</Text>
                <View className="space-y-6 mb-8">
                    <View>
                        <Text className="text-gray-600 mb-1 ml-1 font-medium">Blood Group</Text>
                        <TextInput
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 mb-4"
                            value={formData.bloodGroup}
                            onChangeText={t => setFormData({ ...formData, bloodGroup: t })}
                            placeholder="e.g., O+"
                        />
                    </View>
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 ml-1 font-medium">Height (cm)</Text>
                            <TextInput
                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                                value={formData.height?.toString() || ''}
                                onChangeText={t => setFormData({ ...formData, height: t ? parseFloat(t) : undefined })}
                                placeholder="Height in cm"
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 ml-1 font-medium">Weight (kg)</Text>
                            <TextInput
                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                                value={formData.weight?.toString() || ''}
                                onChangeText={t => setFormData({ ...formData, weight: t ? parseFloat(t) : undefined })}
                                placeholder="Weight in kg"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Allergies Section */}
                <Text className="text-lg font-bold text-green-600 mb-4">Allergies</Text>
                <View className="mb-12">
                    <View className="flex-row gap-2 mb-3">
                        <TextInput
                            className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                            value={allergyInput}
                            onChangeText={setAllergyInput}
                            placeholder="Add an allergy..."
                        />
                        <TouchableOpacity
                            onPress={addAllergy}
                            className="bg-blue-600 justify-center px-6 rounded-xl"
                        >
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                        {formData.allergies.map((allergy, index) => (
                            <View key={index} className="bg-red-50 border border-red-100 px-3 py-2 rounded-lg flex-row items-center">
                                <Text className="text-red-700 font-medium mr-2">{allergy}</Text>
                                <TouchableOpacity onPress={() => removeAllergy(index)}>
                                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView >
        </SafeAreaView >
    );
}
