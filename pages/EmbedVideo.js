import { ScrollView, Text, Button, Alert, View, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import YoutubePlayer from "react-native-youtube-iframe";

const EmbedVideo = () => {
  // State to track playing status of each video
  const [playing, setPlaying] = useState({
    video1: false,
    video2: false,
    video3: false,
    video4: false,
    video5: false,
  });

  // Handle video state changes
  const onStateChange = useCallback((videoId) => (state) => {
    if (state === "ended") {
      setPlaying((prev) => ({ ...prev, [videoId]: false }));
      Alert.alert("The video has finished playing.");
    }
  }, []);

  // Toggle play/pause functionality for individual videos
  const togglePlaying = useCallback((videoId) => {
    setPlaying((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* First Video Section */}
      <View style={styles.videoSection}>
        <YoutubePlayer
          height={200}
          play={playing.video1}
          videoId={"lTCF8y7e1Bw"}
          onChangeState={onStateChange('video1')}
        />
        <Text style={styles.videoTitle}>Cardiovascular Disease Overview</Text>
      </View>
      {/* Second Video Section */}
      <View style={styles.videoSection}>
        <YoutubePlayer
          height={200}
          play={playing.video2}
          videoId={"UN5BlPfMUkg"}
          onChangeState={onStateChange('video2')}
        />
        <Text style={styles.videoTitle}>Why Do We Get Heart Disease and How to Treat It?</Text>
      </View>
      {/* Third Video Section */}
      <View style={styles.videoSection}>
        <YoutubePlayer
          height={200}
          play={playing.video3}
          videoId={"XC9IfkNxo4c"}
          onChangeState={onStateChange('video3')}
        />
        <Text style={styles.videoTitle}>Peter Attia: Tips to improve heart health</Text>
      </View>
      {/* Add more videos here as needed */}
      <View style={styles.videoSection}>
        <YoutubePlayer
          height={200}
          play={playing.video4}
          videoId={"xGUfA5wyNXk"}
          onChangeState={onStateChange('video3')}
        />
        <Text style={styles.videoTitle}>Watch This To Avoid Heart Attack - Lifestyle, Food & Treatment</Text>
      </View>
      <View style={styles.videoSection}>
        <YoutubePlayer
          height={200}
          play={playing.video5}
          videoId={"v9DG6q3I7U8"}
          onChangeState={onStateChange('video3')}
        />
        <Text style={styles.videoTitle}>Why Young Men Are Getting Heart Attacks</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  videoSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
});

export default EmbedVideo;
