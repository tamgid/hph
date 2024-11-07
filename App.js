import { StatusBar } from "expo-status-bar";
import 'react-native-reanimated'; // Import Reanimated
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

import SignIn from "./pages/SignIn";
import FrontPage from "./pages/FrontPage";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import TermCondition from "./pages/TermCondition";
import CheckHealth from "./pages/CheckHealth";
import PredictionResult from "./pages/PredictionResult";
import Upload from "./pages/Upload";
import FullScreenImage from "./pages/FullScreenImage";
import EmailVerification from "./pages/EmailVerification";
import RatingList from "./pages/RatingList";
import PatientInfo from "./pages/PatientInfo";
import EmbedVideo from "./pages/EmbedVideo";
import Map from "./pages/Map";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "./config";
import ChatBot from "./pages/ChatBot";
import CrystalReport from "./pages/CrystalReport";
import EditProfileScreen from "./pages/EditProfileScreen";
import History from "./pages/History";

import "react-native-gesture-handler";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ProfileScreen from "./pages/ProfileScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/graphql",
  cache: new InMemoryCache(),
});

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person-circle" : "person-circle-outline"; // Change the icon name for the "profile" tab
          } else if (route.name === "settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
    >
      <Tab.Screen name="home" component={StackNavigator} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userEmail");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          await firebase
            .auth()
            .signInWithEmailAndPassword(userData.email, userData.password);
          setUser(true);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return null; // You can render a loading indicator here
  }
  return (
    <Stack.Navigator initialRouteName={user ? "HomePage" : "FrontPage"}>
      <Stack.Screen name="FrontPage" component={FrontPage} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="CheckHealth" component={CheckHealth} />
      <Stack.Screen name="PredictionResult" component={PredictionResult} />
      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="FullScreenImage" component={FullScreenImage} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="RatingList" component={RatingList} />
      <Stack.Screen name="PatientInfo" component={PatientInfo} />
      <Stack.Screen name="EmbedVideo" component={EmbedVideo} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="ChatBot" component={ChatBot} />
      <Stack.Screen name="CrystalReport" component={CrystalReport} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="TermCondition" component={TermCondition} />
      <Stack.Screen name="History" component={History} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
