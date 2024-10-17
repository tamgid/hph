import React, { useState, useEffect } from "react";
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

const { height, width } = Dimensions.get("window");

const EmailVerification = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { name, username, password, division, dateOfBirth, country } = route.params;

  const handleSignUp = async () => {
    if (!email) {
      setErrorMessage("Please provide all the necessary information");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000); // Hide message after 3 seconds
      return;
    }
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log("User created:", user);
      //const currentDate = new Date();

      // Send email verification
      await user.sendEmailVerification();

      // Update user profile with display name
      await user.updateProfile({ displayName: username });

      // Store additional user information in Firestore
      await firebase.firestore().collection("users").doc(user.uid).set({
        name: name,
        email: email,
        password: password,
        username: username,
        dateOfBirth: dateOfBirth,
        division: division,
        country: country,
        // Add more fields as needed
      });

      setSuccessMessage("User created successfully");
      setEmail("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Please provide correct information.");
      } else {
        setErrorMessage("Please provide correct email and password.");
      }
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // Hide message after 3 seconds
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
              placeholderTextColor="#c7c7c7"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          {successMessage ? (
              <Text style={styles.successMessage}>{successMessage}</Text>
            ) : null}
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
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
          <TouchableOpacity style={styles.altLoginButton}>
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.altLoginText}>Continue with Google</Text>
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
    fontSize: width * 0.04,
    color: "green",
    textAlign: "center",
    marginBottom: height * 0.02,
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
  signUpButton: {
    backgroundColor: "#3498db",
    width: width * 0.9,
    paddingVertical: height * 0.018,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.05,
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

export default EmailVerification;
