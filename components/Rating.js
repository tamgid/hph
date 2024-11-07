import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../config";

const Rating = ({ navigation, route }) => {
  const { email } = route.params; // You can remove 'name' if you don't need it anymore
  const [review, setReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittedReview, setSubmittedReview] = useState(null);
  const [submittedRating, setSubmittedRating] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const handleRatingPress = (rating) => {
    setSelectedRating(rating);
  };

  const submitRating = async () => {
    const currentDate = new Date();

    try {
      const currentUser = firebase.auth().currentUser; // Get current authenticated user
      if (currentUser) {
        const userDoc = await firebase.firestore().collection("users").doc(currentUser.uid).get();

        if (userDoc.exists) {
          const userData = userDoc.data(); // Fetch user details
          setUserDetails(userData); // Set user details to state

          // Save the selected rating, review, and current date to Firestore
          await firebase
            .firestore()
            .collection("ratings")
            .doc(userData.email) // Use email for document ID
            .set({
              name: userData.name,
              email: userData.email,
              profileImage: userData.profileImage,
              rating: selectedRating,
              review: review,
              timestamp: currentDate, // Convert date to string format for storage
              likes: 0, // Default value for likes
              dislikes: 0, // Default value for dislikes
            });

          // Update state after successful submission
          setSubmittedReview(review);
          setSubmittedRating(selectedRating);
          console.log("Rating submitted successfully.");
        } else {
          console.log("No such user!");
        }
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }

    // Reset the review and rating after submission
    setReview("");
    setSelectedRating(0);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userDoc = await firebase.firestore().collection("users").doc(currentUser.uid).get();
          if (userDoc.exists) {
            setUserDetails(userDoc.data());
          } else {
            console.log("No such user!");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Determine the button color based on review and rating
  const buttonColor = selectedRating > 0 && review.trim() !== "" ? "#3498db" : "#c7c7c7";

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            userDetails && userDetails.profileImage
              ? { uri: userDetails.profileImage }
              : require("../image/User.jpg") // Default image
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userDetails ? userDetails.name : "Loading..."}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={styles.starButton}
            onPress={() => handleRatingPress(rating)}
          >
            <Ionicons
              name={selectedRating >= rating ? "star" : "star-outline"}
              size={25}
              color={selectedRating >= rating ? "#01875f" : "#34b88c"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        multiline={true}
        placeholder="(Required) Tell others what you think"
        value={review}
        onChangeText={setReview}
      />
      <TouchableOpacity style={[styles.submitButton, { backgroundColor: buttonColor }]} onPress={submitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  starButton: {
    padding: 10,
  },
  reviewInput: {
    height: 70,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 3,
    padding: 10,
    marginBottom: 20,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 13,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Rating;
