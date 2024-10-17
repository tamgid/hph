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
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigation = useNavigation();

  const handleContinue = async () => {
    if (!email) {
      setErrorMessage("Please enter your email.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    try {
      const userSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      if (userSnapshot.empty) {
        setErrorMessage("Please provide correct email.");
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
        return;
      }

      await firebase.auth().sendPasswordResetEmail(email);
      setSuccessMessage("Password reset instructions sent to your email.");
      setTimeout(() => {
        setSuccessMessage("");
        setEmail("");
      }, 2000);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setErrorMessage("An error occurred. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../image/login-1.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <Text style={styles.heading}>Enter Email Address</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#808080"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
              <Text style={styles.successMessage}>{successMessage}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Back to</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or continue with</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity
            style={styles.altLoginButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.altLoginText}>Sign Up</Text>
          </TouchableOpacity>
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
    marginBottom: height * 0.03,
  },
  errorMessage: {
    fontSize: width * 0.04,
    color: "red",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  successMessage: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: width * 0.05,
  },
  input: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#00000080",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: width * 0.04,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.05,
  },
  signInButton: {
    backgroundColor: "#3498db",
    width: width * 0.9,
    paddingVertical: height * 0.018,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.07,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  signinContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  signinText: {
    fontSize: width * 0.037,
    color: "#ffffff",
  },
  signinLink: {
    fontSize: width * 0.04,
    color: "#3498db",
    marginLeft: width * 0.02,
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
});

export default ForgotPassword;
