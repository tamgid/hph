import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Confetti from 'react-native-confetti';

const PredictionResult = ({ route, navigation }) => {
  const { predictionMessage, messageColor } = route.params;

  // Determine if the prediction is positive or negative
  const isPositive = predictionMessage.toLowerCase().includes("congratulations");

  // Background image source
  const backgroundImage = isPositive 
    ? require('../image/CongratulationBackground.png') 
    : require('../image/SorryBackground.png');

  // Shared values for animation
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-300); // Start from higher for a dramatic drop
  const scale = useSharedValue(0.3);
  const rotate = useSharedValue(0);

  // Animated styles for the result text
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` }, // Slight rotation for wobble
    ],
  }));

  useEffect(() => {
    // Sequential animation for the drop and slight wobble effect
    opacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });

    translateY.value = withSpring(0, {
      damping: 10, // Spring damping for bounce effect
      stiffness: 120,
      mass: 1.5,
    });

    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });

    // Apply slight wobble effect after the drop
    rotate.value = withSequence(
      withTiming(10, { duration: 100, easing: Easing.inOut(Easing.ease) }), // Rotate right
      withTiming(-8, { duration: 100, easing: Easing.inOut(Easing.ease) }), // Rotate left
      withTiming(5, { duration: 80, easing: Easing.inOut(Easing.ease) }),   // Rotate right, smaller
      withTiming(-3, { duration: 80, easing: Easing.inOut(Easing.ease) }),  // Rotate left, smaller
      withTiming(0, { duration: 60, easing: Easing.inOut(Easing.ease) })    // Settle back to 0 (resting state)
    );
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {/* Result box with beautiful animations */}
        <Animated.View style={[styles.resultBox, animatedStyle]}>
          <Text style={[styles.resultText, { color: messageColor }]}>
            {isPositive ? "You are free from heart disease." : "Your heart health needs attention."}
          </Text>
        </Animated.View>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("CheckHealth")}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>

        {/* Confetti for positive predictions */}
        {isPositive && <Confetti />}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultBox: {
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  resultText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#544530",
    padding: 12,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PredictionResult;
