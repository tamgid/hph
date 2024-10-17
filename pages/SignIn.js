import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { firebase } from "../config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkStoredEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      console.log("Stored email:", storedEmail);
    } catch (error) {
      console.error("Error retrieving stored email:", error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage("Please provide necessary information");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000); // Hide message after 3 seconds
      return;
    }

    try {
      // Check if the input is an email
      const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (isEmailFormat) {
        // Proceed with email-based login
        const userCredential = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        // Store user email in AsyncStorage upon successful login
        const data = {
          email,
          password,
        };
        await AsyncStorage.setItem("userEmail", JSON.stringify(data));

        // Navigate to the HomePage and pass user details as params
        const userData = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", email)
          .get();
        userData.forEach((doc) => {
          const userData = doc.data();
          const { name, email, location, phone, regDate, username } = userData;
          checkStoredEmail();

          // Navigate to the HomePage and pass user details as params
          navigation.navigate("HomePage", {
            name,
            email,
            location,
            phone,
            regDate,
            username,
          });
        });
      } else {
        // Find the email associated with the provided username from Firestore
        const usernameSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("username", "==", email)
          .get();

        if (usernameSnapshot.docs.length > 0) {
          const userData = usernameSnapshot.docs[0].data();
          const userEmail = userData.email;

          // Log in with the retrieved email
          const userCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(userEmail, password);
          const user = userCredential.user;
          // Store user email in AsyncStorage upon successful login
          // await AsyncStorage.setItem("userEmail", userEmail);
          // Navigate to the HomePage and pass user details as params
          const userDatam = await firebase
            .firestore()
            .collection("users")
            .where("email", "==", email)
            .get();
          userDatam.forEach((doc) => {
            const userDatam = doc.data();
            const { name, email } = userDatam;
            setData({
              email: null,
              password: null,
            });
            // Navigate to the HomePage and pass user details as params
            navigation.navigate("HomePage", { name, email });
          });
        } else {
          setErrorMessage("User not found");
          setTimeout(() => {
            setErrorMessage("");
          }, 2000); // Hide message after 3 seconds
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      // Handle error, such as displaying an error message to the user
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Please provide correct information.");
      } else {
        setErrorMessage("Please provide correct email and password.");
      }
      setTimeout(() => {
        setErrorMessage("");
      }, 2000); // Hide message after 3 seconds
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../image/login-1.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <Text style={styles.heading}>Hi, Welcome Back!</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#808080"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#808080"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
            <Text style={styles.buttonText}>Continue with Email</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or continue with</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity style={styles.altLoginButton}>
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.altLoginText}>Continue with Google</Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: width * 0.05,
    color: "#ffffff",
    marginBottom: height * 0.05,
  },
  errorMessage: {
    fontSize: width * 0.04,
    color: "red",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: width * 0.05,
  },
  label: {
    fontSize: width * 0.035,
    color: "#ffffff",
    marginBottom: height * 0.01,
  },
  input: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#00000080",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: width * 0.04,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000080",
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  passwordInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: width * 0.04,
    paddingVertical: height * 0.015,
  },
  eyeIconContainer: {
    marginLeft: width * 0.02,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: height * 0.08,
  },
  forgotPasswordText: {
    fontSize: width * 0.04,
    color: "#ffffff",
  },
  signInButton: {
    backgroundColor: "#3498db",
    width: width * 0.9,
    paddingVertical: height * 0.018,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  line: {
    height: 1,
    backgroundColor: "#808080",
    width: "15%",
  },
  orText: {
    fontSize: width * 0.04,
    color: "#808080",
    marginHorizontal: width * 0.03,
  },
  altLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000080",
    borderRadius: 30,
    paddingVertical: height * 0.011,
    width: width * 0.88,
    justifyContent: "center",
    marginBottom: height * 0.02,
    borderWidth: 1, // Add this line
    borderColor: "#ffffff", // Add this line
  },
  altLoginText: {
    color: "#ffffff",
    fontSize: width * 0.038,
    marginLeft: width * 0.03,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    fontSize: width * 0.037,
    color: "#ffffff",
  },
  signupLink: {
    fontSize: width * 0.04,
    color: "#3498db",
    marginLeft: width * 0.02,
  },
});

export default SignIn;
