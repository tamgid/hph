import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import ChatBubble from "../components/ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const ChatBot1 = () => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const API_KEY = "AIzaSyBPLFj2_buqmmUjeav93PKnNmw7m94vJtQ";

  const handleUserInput = async () => {
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: updatedChat,
        }
      );
      console.log("Gemini Pro API Response:", response.data);

      const modelResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          {
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];
        setChat(updatedChatWithModel);
        setUserInput("");
      }
    } catch (error) {
      console.error("Error calling Gemini Pro API:", error);
      console.error("Error response:", error.response);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async (text) => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <ChatBubble
        role={item.role}
        text={item.parts[0].text}
        onSpeech={() => handleSpeech(item.parts[0].text)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {chat.length === 0 && (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.centeredMessage}>Ask me anything!</Text>
        </View>
      )}
      <FlatList
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      {loading && <ActivityIndicator style={styles.loading} color="#333" />}
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message ChatBot"
          placeholderTextColor="#aaa"
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: userInput.trim() ? "#000" : "#ccc" }, // Change color based on input
          ]}
          onPress={handleUserInput}
          disabled={!userInput.trim()} // Disable the button if input is empty
        >
          <Ionicons name="arrow-up" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatBot1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#f8f8f8",
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessage: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    position: "relative", // Positioning for absolute placement of the icon
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1, // Makes the input take up the full available width
    height: 45,
    padding: 10,
    paddingRight: 50, // Space for the icon inside the input field
    borderRadius: 20,
    color: "#333",
    backgroundColor: "#eeeeee",
  },
  iconButton: {
    position: "absolute", // Absolute positioning within the inputContainer
    right: 1, // Position it 10 units from the right edge of the inputContainer
    top: "55%", // Vertically center the button
    transform: [{ translateY: -22.5 }], // Adjust vertically (half of the button height)
    width: 40, // Fixed width for the button
    height: 40,
    borderRadius: 20, // Circular button
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
