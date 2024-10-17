import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useQuery, gql } from "@apollo/client"; // Import Apollo useQuery

const { height, width } = Dimensions.get("window");

// GraphQL query to fetch countries
const COUNTRY_QUERY = gql`
  query {
    countries {
      name
      code
    }
  }
`;

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [division, setDivision] = useState("");
  const [country, setCountry] = useState(""); // New state for country selection
  const [usernameError, setUsernameError] = useState(""); // Add this line
  const [passwordLengthError, setPasswordLengthError] = useState("");

  const navigation = useNavigation();

  // GraphQL query to get countries list
  const { data, loading, error } = useQuery(COUNTRY_QUERY);

  // Event handler for text box 1
  const handleUsernameChange = (value) => {
    setUsername(value);
    // Check for capital letters
    if (/[A-Z]/.test(value)) {
      setUsernameError("Username should not contain capital letters");
    } else {
      setUsernameError("");
    }
  };

  const handleDivisionChange = (selectedDivision) => {
    try {
      setDivision(selectedDivision);
    } catch (error) {
      console.error("Error handling division change:", error);
      // Handle the error appropriately, such as showing a user-friendly message
    }
  };

  const handleCountryChange = (selectedCountry) => {
    try {
      setCountry(selectedCountry); // Update the selected country
    } catch (error) {
      console.error("Error handling country change:", error);
      // Handle the error appropriately, such as showing a user-friendly message
    }
  };

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(currentDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };

  useEffect(() => {
    // Function to check username availability when username changes
    checkUsernameAvailability();
  }, [username]);

  const checkUsernameAvailability = async () => {
    if (username.trim() === "") {
      // Skip check if username is empty
      setIsUsernameAvailable(true);
      return;
    }
    try {
      const usernameSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("username", "==", username)
        .get();
      if (usernameSnapshot.empty) {
        // Username is available
        setIsUsernameAvailable(true);
      } else {
        // Username already exists
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setIsUsernameAvailable(true); // Reset to true in case of error
    }
  };

  const handleSignUp = async () => {
    // Check if username is available before proceeding with registration
    if (!isUsernameAvailable) {
      setErrorMessage("Username is already taken");
      return;
    }
    if (!name || !password || !username || !division || !country || !dateOfBirth) {
      setErrorMessage("Please provide all the necessary information");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    if (password.length < 6) {
      setPasswordLengthError("Password must be at least 6 character long");
      setTimeout(() => {
        setPasswordLengthError("");
      }, 2000);
      return;
    }
    try {
      navigation.navigate("EmailVerification", {
        name,
        username,
        password,
        division,
        country, // Include country
        dateOfBirth,
      });

      setName("");
      setPassword("");
      setUsername("");
      setDivision("");
      setCountry(""); // Reset country
      setDateOfBirth("");
    } catch (error) {
      console.error("Error creating user:", error);
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
          <Text style={styles.heading}>Create your Account</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#c7c7c7"
              value={name}
              onChangeText={(text) => setName(text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#c7c7c7"
              value={username}
              onChangeText={handleUsernameChange}
              keyboardType="email-address"
            />
            {!isUsernameAvailable && (
              <Text style={styles.errorMessage}>Username is already taken</Text>
            )}
            {usernameError && (
              <Text style={styles.errorMessage}>{usernameError}</Text>
            )}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#c7c7c7"
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
            {passwordLengthError && (
              <Text style={styles.errorMessage}>{passwordLengthError}</Text>
            )}
            <View>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                />
              )}

              {!showPicker && (
                <Pressable onPress={toggleDatepicker}>
                  <TextInput
                    style={styles.input}
                    placeholder="Date of Birth"
                    placeholderTextColor="#c7c7c7"
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    editable={false}
                  />
                </Pressable>
              )}
            </View>
            <Picker
              selectedValue={division}
              onValueChange={handleDivisionChange}
              style={styles.inputPick}
            >
              <Picker.Item label="Select Division" value="" />
              <Picker.Item label="Dhaka" value="Dhaka" />
              <Picker.Item label="Chittagong" value="Chittagong" />
              <Picker.Item label="Rajshahi" value="Rajshahi" />
              <Picker.Item label="Khulna" value="Khulna" />
              <Picker.Item label="Barisal" value="Barisal" />
              <Picker.Item label="Sylhet" value="Sylhet" />
              <Picker.Item label="Rangpur" value="Rangpur" />
              <Picker.Item label="Mymensingh" value="Mymensingh" />
              {/* Add more division options as needed */}
            </Picker>
            {/* Country selection */}
            <Picker
              selectedValue={country}
              onValueChange={handleCountryChange}
              style={styles.inputPick}
            >
              <Picker.Item label="Select Country" value="" />
              {loading ? (
                <Picker.Item label="Loading countries..." value="" />
              ) : error ? (
                <Picker.Item label="Error loading countries" value="" />
              ) : (
                data.countries.map((item) => (
                  <Picker.Item key={item.code} label={item.name} value={item.name} />
                ))
              )}
            </Picker>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                !isUsernameAvailable && styles.disabledButton,
              ]} // Disable button if username is not available
              onPress={handleSignUp}
              disabled={!isUsernameAvailable} // Disable button if username is not available
            >
              <Text style={styles.buttonText}>Next</Text>
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
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signupLink}>Sign In</Text>
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
    marginBottom: height * 0.03,
    marginTop: 10,
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
  input: {
    width: "100%",
    height: height * 0.07,
    backgroundColor: "#00000080",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: width * 0.04,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.01,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000080",
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.01,
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
  inputPick: {
    height: 50,
    color: "#ffffff",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: "#3498db",
    width: width * 0.9,
    paddingVertical: height * 0.017,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
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
    paddingVertical: height * 0.015,
    width: width * 0.88,
    justifyContent: "center",
    marginBottom: height * 0.015,
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

export default Register;
