import React from "react";
import { View, Image, StyleSheet } from "react-native";

const FullScreenImage = ({ route }) => {
  const { imageUri } = route.params; // Get the image URL passed as a parameter

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default FullScreenImage;
