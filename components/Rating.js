import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../config";

const Rating = ({ navigation, route }) => {
  const { email, name } = route.params;
  const [review, setReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRatingPress = (rating) => {
    setSelectedRating(rating);
  };

  const submitRating = () => {
    // Get the current date and time
    const currentDate = new Date();

    // Save the selected rating, review, and current date to Firestore
    firebase
      .firestore()
      .collection("ratings")
      .doc(email)
      .set({
        email: email,
        rating: selectedRating,
        review: review,
        date: currentDate.toISOString(), // Convert date to string format for storage
        likes: 0, // Default value for likes
        dislikes: 0, // Default value for dislikes
      })
      .then(() => {
        console.log("Rating submitted successfully.");
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
      });
    setReview("");
    setSelectedRating("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require("./User.jpg")} style={styles.profileImage} />
        <Text style={styles.profileName}>{name}</Text>
      </View>
      <Text style={styles.reviewInfo}>
        Reviews are public and include your account and device info.
      </Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={styles.starButton}
            onPress={() => handleRatingPress(rating)}
          >
            <Ionicons
              name={selectedRating >= rating ? "star" : "star-outline"}
              size={40}
              color={selectedRating >= rating ? "blue" : "gray"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        multiline={true}
        placeholder="Write your review here..."
        value={review}
        onChangeText={setReview}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
      {/* I need to navigate this page to RatingList page. But it is temporarily navigated to ReactPage */}
      <TouchableOpacity style={styles.ratingsButton} onPress={() => navigation.navigate("RatingList",{name,email})}>
        <Text style={styles.ratingsButtonText}>Ratings and reviews</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="black"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  reviewInfo: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  reviewInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
    fontSize: 17,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    marginBottom:20,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  ratingsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  ratingsButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowIcon: {
    marginLeft: "auto",
  },
});

export default Rating;
