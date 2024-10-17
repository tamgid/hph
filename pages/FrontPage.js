import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const HomePage = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require("../image/home-2.jpg")} // Replace with your actual black background image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Check</Text>
            <Text style={styles.heading}>your</Text>
            <Text style={styles.heading}>Heart</Text>
            <Text style={styles.heading}>Condition</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Predict your heart health with advanced algorithms. Get personalized
            insights and recommendations.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Login Prompt */}
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
  },
  headingContainer: {
    marginTop: height * 0.05,
    marginLeft: width * 0.1,
  },
  heading: {
    fontSize: width * 0.1, // Responsive font size
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "left",
  },
  description: {
    fontSize: width * 0.04, // Responsive font size
    color: "#ffffff",
    textAlign: "left",
    marginTop: height * 0.03, // Adjust the value to control space between heading and description
    marginLeft: width * 0.1,
  },
  button: {
    backgroundColor: "#ffffff",
    width: width * 0.8, // Responsive width
    paddingVertical: height * 0.016,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.22,
    marginBottom: height * 0.025,
    alignSelf: "center", // Center the button horizontally
  },
  buttonText: {
    color: "#000000",
    fontSize: width * 0.044, // Responsive font size
    fontWeight: "bold",
    textAlign: "center",
  },
  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center", // Center the login prompt horizontally
  },
  loginText: {
    fontSize: width * 0.04, // Responsive font size
    color: "#d3d3d3",
    marginRight: width * 0.02,
  },
  loginLink: {
    fontSize: width * 0.04, // Responsive font size
    color: "#ffffff",
  },
});

export default HomePage;
