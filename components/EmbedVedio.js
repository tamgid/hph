import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { WebView } from "react-native-webview";

const EmbedVideo = () => {
  return (
    <ScrollView style={styles.container}>
      <WebView
        source={{ uri: "https://www.youtube.com/watch?v=aXDaBuPSvJs" }} // Replace this with your video URL
        style={styles.video}
      />
      <WebView
        source={{ uri: "https://www.youtube.com/watch?v=mhYeO2fwSps" }} // Replace this with your video URL
        style={styles.video}
      />
      <WebView
        source={{ uri: "https://www.youtube.com/watch?v=KPKLq-LQjbc" }} // Replace this with your video URL
        style={styles.video}
      />
      <WebView
        source={{ uri: "https://www.youtube.com/watch?v=Lj7gM6eIDu0" }} // Replace this with your video URL
        style={styles.video}
      />
      <WebView
        source={{ uri: "https://www.youtube.com/watch?v=DUaxt8OlT3o" }} // Replace this with your video URL
        style={styles.video}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
    aspectRatio: 1 / 1, // You can adjust the aspect ratio as needed
  },
});

export default EmbedVideo;
