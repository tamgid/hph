// src/Map.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";


const hospitals = [
  {
    name: "National Heart Foundation Hospital",
    latitude: 23.8038209888295,
    longitude: 90.361937966157,
  },
  {
    name: "Ibrahim Cardiac Hospital",
    latitude: 23.739018799927564,
    longitude: 90.39655858149841,
  },
  {
    name: "Apollo Hospitals Dhaka",
    latitude: 23.821265923715824,
    longitude: 90.45314258298157,
  },
  {
    name: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
    latitude: 23.73864676929201,
    longitude: 90.39534493731892,
  },
  {
    name: "Evercare Hospital Dhaka",
    latitude: 23.810433645025878,
    longitude: 90.43135408150083,
  },
  {
    name: "United Hospital Limited",
    latitude: 23.80485141660099,
    longitude: 90.41569775081344,
  },
  {
    name: "Square Hospital Limited",
    latitude: 23.753069638761353,
    longitude: 90.38160271033475,
  },
  {
    name: "City Hospital Limited",
    latitude: 23.754184137196027,
    longitude: 90.3654787661553,
  },
  {
    name: "Dhaka Medical College Hospital",
    latitude: 23.72818488505868,
    longitude: 90.39702617944353,
  },
  {
    name: "Chittagong Medical College Hospital",
    latitude: 22.35945446069786,
    longitude: 91.83081522876455,
  },
  {
    name: "Max Hospital Chittagong",
    latitude: 22.355502239344855,
    longitude: 91.82515973727392,
  },
  {
    name: "Cox's Bazar Medical College Hospital",
    latitude: 21.440933125711794,
    longitude: 91.97638566423039,
  },
  {
    name: "Sylhet Osmani Medical College Hospital",
    latitude: 24.90116102651027,
    longitude: 91.85227153735894,
  },
  {
    name: "Rajshahi Medical College Hospital",
    latitude: 24.372181672272184,
    longitude: 88.58644712464803,
  },
  {
    name: "Diabetic Association Hospital",
    latitude: 24.372712177518828,
    longitude: 88.57879596617639,
  },
  {
    name: "Khulna Medical College Hospital",
    latitude: 22.828428244292677,
    longitude: 89.53720527294404,
  },
  {
    name: "Barisal Sher-e-Bangla Medical College Hospital",
    latitude: 22.68656871525952,
    longitude: 90.36139752749473,
  },
  {
    name: "Bogra Medical College Hospital",
    latitude: 24.826909501330196,
    longitude: 89.35433092139685,
  },
];

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchLocationAndRoutes = async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      // Get user's location
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // Fetch routes for all hospitals
      const routesPromises = hospitals.map((hospital) =>
        fetchRoute(location.coords, hospital)
      );
      const routesData = await Promise.all(routesPromises);

      setRoutes(routesData);
      setLoading(false);
    };

    fetchLocationAndRoutes();
  }, []);

  const fetchRoute = async (userCoords, hospital) => {
    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/directions/json`,
        {
          params: {
            origin: `${userCoords.latitude},${userCoords.longitude}`,
            destination: `${hospital.latitude},${hospital.longitude}`,
            key: "AlzaSyA-Zg33RrM2Jp9KAPddljnYxGfpR1O7mke", // Your fixed API key
            mode: "driving", // Set the mode to driving to get car routes
          },
        }
      );

      if (response.data.status === "OK") {
        const points = response.data.routes[0].legs[0].steps.map((step) => {
          const { end_location } = step; // Destructuring end_location
          return { latitude: end_location.lat, longitude: end_location.lng }; // Access lat and lng
        });
        return points; // Return route points
      } else {
        Alert.alert("Error fetching directions:", response.data.error_message);
        return []; // Return empty array on error
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      Alert.alert("Error fetching route:", error.message);
      return []; // Return empty array on error
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {/* Marker for User Location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
          />
        )}

        {/* Markers for All Hospitals */}
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            }}
            title={hospital.name}
            pinColor="red"
          />
        ))}

        {/* Draw Polylines for Routes to All Hospitals */}
        {routes.map(
          (routePoints, index) =>
            routePoints.length > 0 && (
              <Polyline
                key={index}
                coordinates={routePoints}
                strokeColor="green"
                strokeWidth={4}
              />
            )
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;
