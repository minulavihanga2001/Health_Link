import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PatientDashboard() {
    const { signOut, user } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-6">
            <View className="flex-row justify-between items-center mb-8">
                <View>
                    <Text className="text-gray-500 text-lg">Welcome back,</Text>
                    <Text className="text-2xl font-bold text-gray-900">{user?.name || 'Patient'}</Text>
                </View>
                <TouchableOpacity
                    onPress={signOut}
                    className="bg-red-50 p-3 rounded-full"
                >
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <View className="bg-blue-600 rounded-3xl p-6 shadow-lg shadow-blue-200 mb-6">
                <Text className="text-white text-lg font-bold mb-2">My Health Card</Text>
                <Text className="text-blue-100 mb-4">ID: {user?.id || '####-####'}</Text>
                <View className="flex-row items-center bg-blue-500/30 p-3 rounded-xl self-start">
                    <Ionicons name="shield-checkmark" size={20} color="white" />
                    <Text className="text-white ml-2 font-medium">Verified Patient</Text>
                </View>
            </View>

            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-400">Dashboard Content Coming Soon...</Text>
            </View>
        </SafeAreaView>
    );
}
