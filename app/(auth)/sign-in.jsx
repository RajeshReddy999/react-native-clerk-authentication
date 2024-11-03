import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/");
      } else {
        setError("Sign in failed, Please check your credentials");
        // console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors) {
        const identifierError = err.errors.find(
          (error) => error.code === "form_identifier_invalid"
        );
        const passwordError = err.errors.find(
          (error) => error.code === "form_password_incorrect"
        );
        setError(null);
        if (identifierError) {
          setError("User does not exit");
        } else if (passwordError) {
          setError("Your password is incorrect");
        } else {
          setError("Sign in failed");
        }
      } else {
        setError("Unknown error occured");
        // console.error(JSON.stringify(err, null, 2));
      }
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <Text className="text-4xl font-extrabold text-teal-600 mb-4">
        Sign In
      </Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg w-full p-4 mb-4 shadow-md"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        className="bg-white border border-gray-300 rounded-lg w-full p-4 mb-4 shadow-md"
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={onSignInPress}
        className="bg-teal-600 px-4 py-2 w-full rounded-lg shadow-lg"
      >
        <Text className="text-center text-white text-lg font-bold">
          Sign-In
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-700">Don't have an Account?</Text>
        <TouchableOpacity onPress={() => router.push("/sign-up")}>
          <Text className="text-teal-600 font-semibold ml-1">Sign up</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center mt-6">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text className="text-teal-600 font-semibold ml-1">Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
