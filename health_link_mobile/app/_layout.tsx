import { Slot } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import '../global.css';
import { AuthProvider, useAuth, useAuthRedirect } from "../src/context/AuthContext";

// --- 1. The Dynamic Navigator ---
// This component consumes the Auth state to decide which screen group to render.
function InitialLayout() {
    // This is the custom hook that handles redirect logic
    const { isLoading } = useAuth();
    useAuthRedirect();

    // 1. Show Loading State while checking SecureStore
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Text className="mt-4 text-lg text-blue-600">Loading HealthLink...</Text>
            </View>
        );
    }

    // Render the Slot. The navigation logic is handled by useAuthRedirect and the file structure.
    return <Slot />;
}


// --- 2. The Root Provider ---
export default function RootLayout() {
    return (
        // The entire application must be wrapped in the AuthProvider
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}