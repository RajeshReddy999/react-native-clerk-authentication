import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setError(null);
    } catch (err) {
      if (err.errors) {
        const passwordError = err.errors.find(
          (error) => error.code === "form_password_pwned"
        );
        const lengthError = err.errors.find(
          (error) => error.code === "form_password_length_too_short"
        );
        setError(null);
        if (passwordError) {
          setError(
            "Your password has been found in a data breach,Please use a different password"
          );
        } else if (lengthError) {
          setError("Your password should be a least 8 characters long");
        } else {
          setError("Sign up failed");
        }
      }
      setError("Unknown error occured");
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setError(null);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/sign-in");
      } else {
        setError("Verification Error");
        // console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      setError("Verification Error");
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <Text className="text-4xl font-extrabold text-teal-600 mb-4">
        Sign Up
      </Text>
      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}
      {!pendingVerification && (
        <>
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
            onPress={onSignUpPress}
            className="bg-teal-600 px-4 py-2 w-full rounded-lg shadow-lg"
          >
            <Text className="text-center text-white text-lg font-bold">
              Sign-Up
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-700">Already have an Account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text className="text-teal-600 font-semibold ml-1">Sign in</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {pendingVerification && (
        <>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg w-full p-4 mb-4 shadow-md"
            value={code}
            placeholder="Code..."
            onChangeText={setCode}
          />
          <TouchableOpacity
            onPress={onPressVerify}
            className="bg-teal-600 px-4 py-2 w-full rounded-lg shadow-lg"
          >
            <Text className="text-center text-white text-lg font-bold">
              Verify Email
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-6">
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="text-teal-600 font-semibold ml-1">
                Go to Home
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
