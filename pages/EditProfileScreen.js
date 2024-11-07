import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView } from "react-native";
import { firebase } from "../config"; // Your Firebase config file
import { useNavigation } from "@react-navigation/native"; // To navigate

const { width, height } = Dimensions.get("window");

const EditProfileScreen = () => {
  const navigation = useNavigation(); // Navigation hook to go back after saving
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedDob, setUpdatedDob] = useState("");
  const [updatedDivision, setUpdatedDivision] = useState("");
  const [updatedCountry, setUpdatedCountry] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            setUserDetails(userDoc.data());
            // Pre-fill the state with current user details
            setUpdatedName(userDoc.data().name);
            setUpdatedEmail(userDoc.data().email);
            setUpdatedDob(userDoc.data().dateOfBirth);
            setUpdatedDivision(userDoc.data().division);
            setUpdatedCountry(userDoc.data().country);
            setUpdatedUsername(userDoc.data().username);
          } else {
            console.log("No such user!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleSave = async () => {
    try {
      const user = firebase.auth().currentUser;
      await firebase.firestore().collection("users").doc(user.uid).update({
        name: updatedName,
        email: updatedEmail,
        dateOfBirth: updatedDob,
        division: updatedDivision,
        country: updatedCountry,
        username: updatedUsername,
      });

      Alert.alert("Profile Updated", "Your profile has been updated successfully.");
      navigation.goBack(); // Go back to the previous screen after saving
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert("Error", "There was an issue updating your profile.");
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={updatedName}
          onChangeText={setUpdatedName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={updatedEmail}
          onChangeText={setUpdatedEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={updatedDob}
          onChangeText={setUpdatedDob}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Division</Text>
        <TextInput
          style={styles.input}
          value={updatedDivision}
          onChangeText={setUpdatedDivision}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={updatedCountry}
          onChangeText={setUpdatedCountry}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={updatedUsername}
          onChangeText={setUpdatedUsername}
        />
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#34b88c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditProfileScreen;
