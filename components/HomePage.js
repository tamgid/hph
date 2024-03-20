import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [regDate, setRegDate] = useState("");
  const [username, setUsername] = useState("");
  // const { name, email, location, phone, regDate, username } = route.params;

  useEffect(() => {
    checkStoredEmail();
  }, []);

  const checkStoredEmail = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userEmail");
      // console.log("Stored email:", storedEmail);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log(userData.email);
        // Navigate to the HomePage and pass user details as params
        // Query Firestore to get user data based on email
        const userSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", userData.email)
          .get();

        // Extract user data from the document
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          const { name, email, location, phone, regDate, username } = userData;
          setName(name);
          setEmail(email);
          setLocation(location);
          setPhone(phone);
          setRegDate(regDate);
          setUsername(username);
        });
      }
    } catch (error) {
      console.error("Error retrieving stored email:", error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          // If swiped to the left by at least 50 units, close the sidebar
          closeSidebar();
        } else {
          // If not swiped enough, reset the position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const buttonData = [
    { id: 1, text: "Check Health", icon: "heartbeat", screen: "CheckHealth" },
    { id: 2, text: "React Review", icon: "thumbs-up", screen: "RatingList" },
    { id: 3, text: "About HPH", icon: "info-circle", screen: "About" },
    { id: 4, text: "Rate this App", icon: "star", screen: "Rating" },
    { id: 5, text: "Necessary Upload", icon: "upload", screen: "Upload" },
    { id: 6, text: "Patient List", icon: "user", screen: "PatientInfo" },
    { id: 7, text: "Health Video", icon: "video-camera", screen: "EmbedVedio" },
    { id: 8, text: "Your Location", icon: "map-marker", screen: "Map" },
    { id: 9, text: "ChatBot", icon: "comments", screen: "ChatBot1" },
    { id: 10, text: "Graph QL", icon: "database", screen: "GraphQl" },
  ];

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    // Reset translateX value when opening/closing the sidebar
    Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    // Reset translateX value when closing the sidebar
    Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
  };

  const sidebarStyle = {
    transform: [{ translateX }],
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage has been cleared successfully.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const handleSignOut = () => {
    clearAsyncStorage();
    firebase 
      .auth()
      .signOut()
      .then(() => {
        // Navigate to FrontPage after successful sign-out
        navigation.navigate("FrontPage");
      })
      .catch((error) => {
        // Handle sign-out errors
        console.error("Sign-out error:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Icon */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarIcon}>
        <Icon name={sidebarVisible ? "close" : "bars"} size={30} color="#999" />
      </TouchableOpacity>

      {/* Main Content */}
      <View
        style={styles.mainContent}
        {...(sidebarVisible ? panResponder.panHandlers : {})}
      >
        <Text style={styles.title}>Health Predict Hub</Text>

        {/* Updated Main Content */}
        <View style={styles.buttonContainer}>
          {buttonData.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={styles.squareButton}
              onPress={() =>
                navigation.navigate(button.screen, {
                  name,
                  email,
                  location,
                  phone,
                  regDate,
                  username,
                })
              }
            >
              <Icon name={button.icon} size={40} color="#fff" />
              <Text style={styles.buttonText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View style={[styles.sidebar, sidebarStyle]}>
          {/* Developer Info */}
          <View style={styles.developerInfo}>
            <Image
              source={require("./User.jpg")}
              style={styles.developerImage}
            />
            <Text style={styles.developerName}>{name}</Text>
            <Text style={styles.developerEmail}>{email}</Text>
          </View>

          {/* Sidebar Options */}
          <TouchableOpacity
            style={styles.sidebarOption}
            onPress={() => navigation.navigate("CheckHealth")}
          >
            <Icon
              name="user-circle"
              size={20}
              color="#333"
              style={styles.sidebarOptionIcon}
            />
            <Text style={styles.sidebarOptionText}>Check Health</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.sidebarOption}
            onPress={() => navigation.navigate("Upload")}
          >
            <Icon
              name="upload"
              size={20}
              color="#333"
              style={styles.sidebarOptionIcon}
            />
            <Text style={styles.sidebarOptionText}>Upload</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.sidebarOption}
            onPress={() => navigation.navigate("Comment")}
          >
            <Icon
              name="comment"
              size={20}
              color="#333"
              style={styles.sidebarOptionIcon}
            />
            <Text style={styles.sidebarOptionText}>Comment</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.sidebarOption}
            onPress={() => navigation.navigate("ReactPage")}
          >
            <Icon
              name="thumbs-up"
              size={20}
              color="#333"
              style={styles.sidebarOptionIcon}
            />
            <Text style={styles.sidebarOptionText}>React</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.sidebarOption}
            onPress={handleSignOut} // Call handleSignOut function onPress
          >
            <Icon
              name="sign-out"
              size={20}
              color="#333"
              style={styles.sidebarOptionIcon}
            />
            <Text style={styles.sidebarOptionText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebarIcon: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  squareButton: {
    width: "44%", // Adjust as needed for spacing
    height: "20%",   
    backgroundColor: "#4681f4", // You can change the color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15, // Adjust for vertical spacing
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 250,
    backgroundColor: "#fff",
    elevation: 5,
    zIndex: 2,
    padding: 20,
  },
  developerInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  developerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 30,
  },
  developerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  developerEmail: {
    color: "#555",
  },
  sidebarOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sidebarOptionIcon: {
    marginRight: 10,
  },
  sidebarOptionText: {
    fontSize: 16,
  },
});

export default HomePage;
