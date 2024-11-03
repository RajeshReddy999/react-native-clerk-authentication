import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import "react-native-gesture-handler";
import "../global.css";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("sign-in");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <SignedIn>
        <View className="bg-white shadow-md rounded-md p-6 w-11/12 max-w-md">
          <Text className="text-teal-600 text-3xl font-bold mb-4 text-center">
            Welcome Back!!
          </Text>
          <Text className="text-teal-700 text-xl font-bold mb-4 text-center">
            Hello {user?.emailAddresses[0].emailAddress}
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-teal-600 p-4 mt-4 rounded-lg shadow-lg"
          >
            <Text className="text-center text-white text-lg font-bold">
              Log-Out
            </Text>
          </TouchableOpacity>
        </View>
      </SignedIn>

      <SignedOut>
        <View className="bg-white shadow-md rounded-md p-6 w-11/12 max-w-md">
          <Text className="text-teal-600 text-3xl font-bold mb-4 text-center">
            Welcome!
          </Text>
          <Text className="text-teal-600 text-3xl font-bold mb-4 text-center">
            Please sign in or sign up to continue
          </Text>
          <View className="flex-row justify-between px-3 mt-2">
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="bg-teal-600 px-4 py-2 mr-2 rounded-lg shadow-lg"
            >
              <Text className="text-center text-white text-lg font-bold">
                Sign-In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              className="bg-teal-600 px-4 py-2 mr-2 rounded-lg shadow-lg"
            >
              <Text className="text-center text-white text-lg font-bold">
                Sign-Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SignedOut>
    </View>
  );
}
