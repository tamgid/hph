import React, {useState, useEffect} from "react";
import MapView, {Marker} from "react-native-maps";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";
import * as Location from 'expo-location';

const Map = () => {
    const [mapRegion, setMapRegion] = useState({
        latitude:   22.471038,
        longitude: 91.788466,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const userLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            setErrorMsg('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        console.log(location.coords.latitude, location.coords.longitude);
    }

    useEffect(() => {
        userLocation();
    }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
        region={mapRegion}
      >
      <Marker coordinate={mapRegion} title="Marker" />
      </MapView>
      <Button title="Get Location" onPress={userLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Map;
