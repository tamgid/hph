import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const HomePage = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [regDate, setRegDate] = useState("");
  const [username, setUsername] = useState("");
  const [isPressed, setIsPressed] = useState(false); // Track button press state

  const [profileImage, setProfileImage] = useState(null); // State to store profile image URI

  // const { name, email, location, phone, regDate, username } = route.params;

  useEffect(() => {
    checkStoredEmail();
  }, []);

  const checkStoredEmail = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userEmail");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", userData.email)
          .get();

        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          const {
            name,
            email,
            location,
            phone,
            regDate,
            username,
            profileImage,
          } = userData;
          setName(name);
          setEmail(email);
          setLocation(location);
          setPhone(phone);
          setRegDate(regDate);
          setUsername(username);
          setProfileImage(profileImage); // Set profile image URL here
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
    { id: 1, text: "CheckHeart", icon: "heartbeat", screen: "CheckHealth" },
    { id: 2, text: "Reviews", icon: "thumbs-up", screen: "RatingList" },
    { id: 3, text: "CardioDocs", icon: "upload", screen: "Upload" },
    { id: 4, text: "Visitors", icon: "user", screen: "PatientInfo" },
    { id: 5, text: "CardioCare", icon: "video-camera", screen: "EmbedVideo" },
    { id: 6, text: "Geolocation", icon: "map-marker", screen: "Map" },
    { id: 7, text: "Counselor", icon: "comments", screen: "ChatBot" },
    {
      id: 8,
      text: "CrystalReport",
      icon: "clipboard",
      screen: "CrystalReport",
    },
    { id: 9, text: "History", icon: "history", screen: "History" },
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
    <ScrollView style={styles.container}>
      {/* Part 1: Top Header with Sidebar Icon and App Name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <View style={styles.iconWrapper}>
            <Icon
              name={sidebarVisible ? "close" : "bars"}
              size={22}
              color="#4B5563"
              weight="light"
            />
          </View>
        </TouchableOpacity>
        <View style={styles.appNameContainer}>
          <Text style={styles.appName}>Health Predict Hub</Text>
        </View>
      </View>

      <View style={styles.subContainer}>
        {/* Part 2: Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for diseases"
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Icon name="search" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Part 3: Banner Section with Image, Text, and Button */}
        <ImageBackground
          source={require("../image/homeBackground.png")}
          style={[styles.banner, { height: height / 5 }]}
        >
          {/* Button is placed in the bottom-right corner of the banner */}
          <TouchableOpacity
            style={[
              styles.predictButton,
              isPressed && styles.predictButtonPressed, // Apply pressed styles
            ]}
            onPressIn={() => setIsPressed(true)} // Button press starts
            onPressOut={() => setIsPressed(false)} // Button press ends
            onPress={() => navigation.navigate("CheckHealth")} // Navigate on press
          >
            <Text
              style={[
                styles.buttonText,
                isPressed && styles.buttonTextPressed, // Change text style on press
              ]}
            >
              Predict Now
            </Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Part 4: Categories and Show All Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.buttonText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.showAllButton}>
            <Text style={styles.buttonText}>Show All</Text>
          </TouchableOpacity>
        </View>

        <View {...(sidebarVisible ? panResponder.panHandlers : {})}>
          {/* Updated Main Content */}
          <View style={styles.gridContainer}>
            {buttonData.map((button) => (
              <TouchableOpacity
                key={button.id}
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
                style={styles.categoryItem}
              >
                <Icon name={button.icon} size={25} color="#4991b2" />
                <Text style={styles.categoryText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View style={[styles.sidebar, sidebarStyle]}>
          <View style={styles.profileContainer}>
            {/* Developer Info */}
            <View style={styles.developerInfo}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../image/User.jpg")
                }
                style={styles.profilePicture}
              />
              <Text style={styles.developerName}>{name}</Text>
            </View>
          </View>

          {/* Sidebar Options */}
          <View style={styles.detailsContainer}>
            <TouchableOpacity
              style={styles.sidebarOption}
              onPress={() => {
                navigation.navigate("HomePage");
                closeSidebar(); // Close the sidebar when navigating to HomePage
              }}
            >
              <Icon
                name="home"
                size={24}
                color="#333"
                style={styles.sidebarOptionIcon}
              />
              <Text style={styles.sidebarOptionText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sidebarOption}
              onPress={() => navigation.navigate("Profile")}
            >
              <Icon
                name="user"
                size={24}
                color="#333"
                style={styles.sidebarOptionIcon}
              />
              <Text style={styles.sidebarOptionText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarOption}
              onPress={() => navigation.navigate("AboutUs")}
            >
              <Icon
                name="info-circle"
                size={24}
                color="#333"
                style={styles.sidebarOptionIcon}
              />
              <Text style={styles.sidebarOptionText}>About App</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarOption}
              onPress={() => navigation.navigate("ContactUs")}
            >
              <Icon
                name="question-circle"
                size={24}
                color="#333"
                style={styles.sidebarOptionIcon}
              />
              <Text style={styles.sidebarOptionText}>Contact With Team</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarOption}
              onPress={() => navigation.navigate("TermCondition")}
            >
              <Icon
                name="file-text"
                size={22}
                color="#333"
                style={styles.sidebarOptionIcon}
              />
              <Text style={styles.sidebarOptionText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarOption}
              onPress={handleSignOut} // Call handleSignOut function onPress
            >
              <Icon
                name="sign-out"
                size={23}
                color="#333"
                style={styles.sidebarOptionIcon}
              />
              <Text style={styles.sidebarOptionText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f5f2", // Light gray background
  },
  profileContainer: {
    backgroundColor: "#34b88c",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  detailsContainer: {
    position: "relative",
    backgroundColor: "#f9f5f2",
    paddingLeft: width * 0.09,
    paddingTop: height * 0.02,
    height: "100%", // Ensures the sidebar covers the entire height of the screen
  },
  /* Part 1: Header */
  header: {
    height: height * 0.08, // Set fixed height for header
    justifyContent: "center", // Center vertically
    marginBottom: height * 0.006,
    position: "relative", // For absolute positioning of the menu icon
  },
  menuIcon: {
    position: "absolute",
    left: 18,
    top: "50%",
    transform: [{ translateY: -15 }], // Vertically center the menu icon
  },
  iconWrapper: {
    width: 35, // Adjust size to fit your design
    height: 35, // Adjust size to fit your design
    borderRadius: 20, // Half of the width/height to make it a circle
    borderWidth: 2, // Border thickness
    borderColor: "#4B5563", // Color of the circle border
    justifyContent: "center",
    alignItems: "center",
  },
  appNameContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the app name and heart icon horizontally
    alignItems: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20,
    color: "#4B5563", // Dark gray color
  },

  subContainer: {
    backgroundColor: "#eeeeee", // Light gray background
    paddingHorizontal: 20,
  },

  /* Part 2: Search Bar */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // For Android shadow
  },
  searchInput: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 5,
    color: "#4B5563", // Dark gray for text
    fontSize: 15,
  },

  /* Part 3: Banner Section */
  banner: {
    justifyContent: "center",
    marginBottom: 16,
    position: "relative", // To allow absolute positioning of the button
    borderRadius: 10, // Adjust the radius value as per your design
    overflow: "hidden", // Ensures the rounded corners apply to the image as well
  },

  predictButton: {
    backgroundColor: "#fcede9", // Light purple
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  predictButtonPressed: {
    backgroundColor: "#eab5b5", // Darker shade when pressed
  },
  buttonText: {
    color: "#2d799c", // Blueish text
    fontWeight: "600",
    fontSize: 14,
  },
  buttonTextPressed: {
    color: "#174b5c", // Darker blue text when button is pressed
  },

  /* Part 4: Button Row */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryButton: {
    marginLeft: width * 0.01,
    marginTop: height * 0.01,
  },
  showAllButton: {
    marginRight: width * 0.01,
    marginTop: height * 0.01,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to multiple rows
    justifyContent: "space-between", // Space between items in each row
  },
  categoryItem: {
    flexBasis: "30%", // Each button will take up 30% of the width (3 per row)
    alignItems: "center", // Center icon and text
    marginVertical: 8, // Vertical spacing between buttons
    paddingTop: 15,
    paddingBottom: 12,
    borderRadius: 10, // Rounded corners for buttons
    backgroundColor: "#f5f5f5",
  },
  categoryText: {
    marginTop: 10, // Space between the icon and text
    fontSize: 13,
    color: "#2d799c", // Blueish text
    textAlign: "center", // Center align the text
    marginBottom: height * 0.01,
  },

  sidebar: {
    position: "absolute",
    width: 280,
    elevation: 5,
    zIndex: 2,
  },
  developerInfo: {
    alignItems: "flex-start", // Align items to the start (left) of the container
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  developerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  sidebarOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  sidebarOptionIcon: {
    marginRight: 10,
  },
  sidebarOptionText: {
    fontSize: 15,
    color: "#696969",
  },
});

export default HomePage;
