import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { firebase } from "../config";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import Edit from "../image/pencil.png"

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation(); // Use navigation hook to get navigation prop
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

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

  if (!userDetails) {
    return <Text>No User Data Available</Text>;
  }

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  const uploadImage = async (uri) => {
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref(`users/${user.uid}/profile.jpg`);
    const response = await fetch(uri);
    const blob = await response.blob();

    await storageRef.put(blob);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
  };

  const updateUserProfileImage = async (downloadURL) => {
    const user = firebase.auth().currentUser;
    await firebase.firestore().collection("users").doc(user.uid).update({
      profileImage: downloadURL,
    });
  };

  const handleImagePick = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        const downloadURL = await uploadImage(imageUri);
        await updateUserProfileImage(downloadURL);
        setProfileImage(downloadURL);
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageContainer}
        >
          <Image
            source={
              userDetails?.profileImage
                ? { uri: userDetails.profileImage }
                : require("../image/tamgid.jpg")
            }
            style={styles.profilePicture}
            onError={() => console.log("Failed to load profile image")}
          />
          <Icon
            name="camera"
            size={20}
            color="#fff"
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{userDetails.name || "User Name"}</Text>
      </View>

      <View style={styles.detailsContainer}>
        {/* Pen icon for editing profile */}
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfileScreen")}
          style={styles.penIconContainer}
        >
          <Image
            source={Edit} // Use the local path or URL
            style={styles.icon}
          />
        </TouchableOpacity>

        <View style={styles.detail}>
          <Text style={styles.label}>YOUR EMAIL</Text>
          <Text style={styles.value}>{userDetails.email || "No Email"}</Text>
        </View>

        <View style={[styles.detail, styles.borderTop]}>
          <Text style={styles.label}>DATE OF BIRTH</Text>
          <Text style={styles.value}>
            {userDetails.dateOfBirth || "No Date of Birth"}
          </Text>
        </View>

        <View style={[styles.detail, styles.borderTop]}>
          <Text style={styles.label}>DIVISION</Text>
          <Text style={styles.value}>
            {userDetails.division || "No Division"}
          </Text>
        </View>

        <View style={[styles.detail, styles.borderTop]}>
          <Text style={styles.label}>COUNTRY</Text>
          <Text style={styles.value}>
            {userDetails.country || "No Division"}
          </Text>
        </View>

        <View style={[styles.detail, styles.borderTop]}>
          <Text style={styles.label}>USERNAME</Text>
          <Text style={styles.value}>
            {userDetails.username || "No Username"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "#34b88c",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: height * 0.05,
    paddingTop: height * 0.05,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 18,
    marginLeft: 10,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: width * 0.6,
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: height * 0.02,
    marginHorizontal: 30,
    marginBottom: 50,
    position: "relative",
  },
  penIconContainer: {
    position: "absolute",
    right: 0,
    top: 15,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain", // Ensure it fits well within the specified size
  },
  detail: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 13,
  },
  label: {
    fontSize: 12,
    fontWeight: "300",
    color: "#666",
    marginBottom: 10,
  },
  value: {
    fontSize: 15,
    color: "#333",
  },
  imageContainer: {
    position: "relative",
    alignItems: "flex-start",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
    color: "#fff",
  },
});

export default ProfileScreen;
