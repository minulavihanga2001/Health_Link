import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerificationSuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function VerificationSuccessModal({ visible, onClose }: VerificationSuccessModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}

        >
            <View style={styles.centeredView} className="items-center px-6">
                {/* Blur Background */}
                <BlurView
                    intensity={Platform.OS === 'ios' ? 20 : 50}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                />

                {/* Modal Content */}
                <View className="bg-white max-w-[300px] p-6 rounded-3xl items-center shadow-xl]">

                    {/* Success Icon */}
                    <View className="bg-green-100 rounded-full mb-4">
                        <MaterialIcons name="check-circle" size={48} color="#22C55E" />
                    </View>

                    {/* Title */}
                    <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                        Account Verified!
                    </Text>

                    {/* Message */}
                    <Text className="text-base text-gray-600 text-center mb-6 leading-6">
                        Your email has been verified. Please proceed to complete your personal details.
                    </Text>

                    {/* Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-[#1976D2] py-3 px-6 rounded-xl w-full active:bg-blue-700"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-lg font-bold text-center">
                            Proceed
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
