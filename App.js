import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "./components/SignIn";
import FrontPage from "./components/FrontPage";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import CheckHealth from "./components/CheckHealth";
import Comment from "./components/Comment";
import GraphQl from "./components/GraphQl";
import About from "./components/About";
import Upload from "./components/Upload";
import Rating from "./components/Rating";
import CommentList from "./components/CommentList";
import EmailVerification from "./components/EmailVerification";
import RatingList from "./components/RatingList";
import PatientInfo from "./components/PatientInfo";
import EmbedVedio from "./components/EmbedVedio";
import Map from "./components/Map";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "./config";
import Card from "./components/Card";
import WalletCard from "./components/WalletCard";
import ChatBot1 from "./components/ChatBot1";

import "react-native-gesture-handler";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ProfileScreen from "./components/ProfileScreen";
import SettingsScreen from "./components/SettingsScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache()
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
      <Tab.Screen name="profile" component={ProfileScreen} />
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
      <Stack.Screen name="Comment" component={Comment} />
      <Stack.Screen name="GraphQl" component={GraphQl} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="CommentList" component={CommentList} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="RatingList" component={RatingList} />
      <Stack.Screen name="PatientInfo" component={PatientInfo} />
      <Stack.Screen name="EmbedVedio" component={EmbedVedio} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Card" component={Card} />
      <Stack.Screen name="WalletCard" component={WalletCard} />
      <Stack.Screen name="ChatBot1" component={ChatBot1} />
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
