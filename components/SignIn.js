import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { firebase } from "../config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkStoredEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      console.log("Stored email:", storedEmail);
      // If email is found, navigate to home page
      // if (storedEmail) {
      //   navigation.navigate("HomePage");
      // }
    } catch (error) {
      console.error("Error retrieving stored email:", error);
    }
  };

  const handleSignIn = async () => {
    if (!data.email || !data.password) {
      setErrorMessage("Please provide necessary information");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // Hide message after 3 seconds
      return;
    }

    try {
      // Check if the input is an email
      const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

      if (isEmailFormat) {
        // Proceed with email-based login
        const userCredential = await firebase
          .auth()
          .signInWithEmailAndPassword(data.email, data.password);
        const user = userCredential.user;
        // Store user email in AsyncStorage upon successful login
        await AsyncStorage.setItem("userEmail", JSON.stringify(data));

        // Navigate to the HomePage and pass user details as params
        const userData = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", data.email)
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
          .where("username", "==", data.email)
          .get();

        if (usernameSnapshot.docs.length > 0) {
          const userData = usernameSnapshot.docs[0].data();
          const userEmail = userData.email;

          // Log in with the retrieved email
          const userCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(userEmail, data.password);
          const user = userCredential.user;
          // Store user email in AsyncStorage upon successful login
          // await AsyncStorage.setItem("userEmail", userEmail);
          // Navigate to the HomePage and pass user details as params
          const userDatam = await firebase
            .firestore()
            .collection("users")
            .where("email", "==", user.email)
            .get();
          userDatam.forEach((doc) => {
            const userDatam = doc.data();
            const { name, email } = userDatam;

            // Navigate to the HomePage and pass user details as params
            navigation.navigate("HomePage", { name, email });
          });
        } else {
          setErrorMessage("User not found");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000); // Hide message after 3 seconds
        }
      }

      // Clear input fields
      setData({
        email: null,
        password: null,
      });
      
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
      }, 3000); // Hide message after 3 seconds
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Let's Sign you in</Text>
      <Text style={styles.welcomeText}>Welcome back, You have been missed</Text>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={data.email}
          onChangeText={(text) => setData({ ...data, email: text })}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={data.password}
            onChangeText={(text) => setData({ ...data, password: text })}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.forgotPassword}
        >
          <Text>Forgot Password ?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: Dimensions.get("window").height * 0.01,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: Dimensions.get("window").height * 0.05,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: Dimensions.get("window").height * 0.02,
  },
  input: {
    height: Dimensions.get("window").height * 0.06,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: Dimensions.get("window").height * 0.06,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
  },
  forgotPassword: {
    marginTop: Dimensions.get("window").height * 0.02,
    alignSelf: "flex-end",
    color: "blue",
  },
  signInButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerLink: {
    marginLeft: 5,
    color: "#3498db",
    fontWeight: "bold",
  },
});

export default SignIn;
