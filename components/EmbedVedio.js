import { ScrollView, Text, Button, Alert, View, StyleSheet } from "react-native";
import React, { useState, useCallback, useRef } from "react";
import YoutubePlayer from "react-native-youtube-iframe";

const EmbedVedio = () => {
  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
      <Text style={styles.heading}>How to check is your heart good?</Text>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={"CjpR9UbiF0E"}
        onChangeState={onStateChange}
      />
      </View>
      <View style={styles.subContainer}>
      <Text style={styles.heading}>How to check is your heart good?</Text>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={"CjpR9UbiF0E"}
        onChangeState={onStateChange}
      />
      </View>
      <View style={styles.subContainer}>
      <Text style={styles.heading}>How to check is your heart good?</Text>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={"CjpR9UbiF0E"}
        onChangeState={onStateChange}
      />
      </View>
      <View style={styles.subContainer}>
      <Text style={styles.heading}>How to check is your heart good?</Text>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={"CjpR9UbiF0E"}
        onChangeState={onStateChange}
      />
      </View>
      <View style={styles.subContainer}>
      <Text style={styles.heading}>How to check is your heart good?</Text>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={"CjpR9UbiF0E"}
        onChangeState={onStateChange}
      />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  subContainer:{
    marginBottom: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default EmbedVedio;
