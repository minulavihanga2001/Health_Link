import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const logo = require("../assets/full_logo.png");

export default function Index() {
  const router = useRouter();

  const features = [
    { 
      icon: "🧠", 
      text: "AI-powered medical record summary" 
    },
    { 
      icon: "🌐", 
      text: "Full support for Sinhala & English" 
    },
    { 
      icon: "🔒", 
      text: "You own your health data forever" 
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingHorizontal: 32, 
          paddingTop: 32, 
          paddingBottom: 64 
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Logo at the top */}
        <View className="items-center mb-8">
          <Image
            source={logo}
            style={{ width: 300, height: 160 }}
            resizeMode="contain"
          />
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center mt-[-60px]">
          <Text className="text-5xl font-extrabold text-center text-gray-900 leading-tight">
            Welcome People !
          </Text>

          <Text className="mt-6 text-lg text-center text-gray-500 leading-7 px-4">
            All your medical records are with you now.{"\n"}
            Sign up and start your journey with us.
          </Text>

          {/* Feature List */}
          <View className="w-full mt-12 space-y-4 items-center">
            {features.map((item, index) => (
              <View 
                key={index} 
                className="w-[300px] flex-row items-start bg-gray-100 p-2 mt-2 rounded-2xl"
              >
                <Text className="text-2xl mr-4">{item.icon}</Text>
                <Text className="text-base text-gray-700 flex-1 leading-6 pt-1">
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom CTA */}
        <View className="items-center mt-12">
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            className="bg-[#1976D2] w-full px-12 py-5 rounded-full shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl font-bold text-center">
              Let's Begin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/login")}
            className="mt-6"
          >
            <Text className=" text-base font-semibold">
              Already have an account? <Text className="underline text-[#1976D2]">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}