import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PharmacistDashboard() {
    const { signOut, user } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-6">
            <View className="flex-row justify-between items-center mb-8">
                <View>
                    <Text className="text-gray-500 text-lg">Pharmacist Portal</Text>
                    <Text className="text-2xl font-bold text-gray-900">{user?.name || 'Pharmacist'}</Text>
                </View>
                <TouchableOpacity
                    onPress={signOut}
                    className="bg-red-50 p-3 rounded-full"
                >
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <View className="bg-emerald-600 rounded-3xl p-6 shadow-lg shadow-emerald-200 mb-6">
                <Text className="text-white text-lg font-bold mb-2">Pharmacy License</Text>
                <Text className="text-emerald-100 mb-4">Status: Pending Verification</Text>
                {/* Placeholder for future verification status */}
            </View>

            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-400">Pharmacist Tools Coming Soon...</Text>
            </View>
        </SafeAreaView>
    );
}
