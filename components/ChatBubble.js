import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatBubble = ({ role, text, onSpeech }) => {
  return (
    <View
      style={[
        styles.chatBubble,
        role === "user" ? styles.userBubble : styles.modelBubble,
      ]}
    >
      <Text
        style={[
          styles.chatText,
          role === "user" ? styles.userText : styles.modelText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '90%', // Makes the bubbles wider (you can adjust to your preference)
    alignSelf: "flex-start", // Default alignment
  },
  userBubble: {
    backgroundColor: "#2d799c", // Change to desired user background color
    alignSelf: "flex-end", // Align user bubbles to the right
  },
  modelBubble: {
    backgroundColor: "#eeeeee", // Change to desired model response background color
    alignSelf: "flex-start", // Align model bubbles to the left
  },
  chatText: {
    fontSize: 15,
  },
  userText: {
    color: "#fff", // User text color (white, since the bubble is blue)
  },
  modelText: {
    color: "#333", // Model text color (dark text on light background)
  },
});

export default ChatBubble;
