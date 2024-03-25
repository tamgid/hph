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
  const { email, name } = route.params;
  const [review, setReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittedReview, setSubmittedReview] = useState(null);
  const [submittedRating, setSubmittedRating] = useState(null);

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
        setSubmittedReview(review);
        setSubmittedRating(selectedRating);
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
      });
    setReview("");
    setSelectedRating("");
  };
  useEffect(() => {
    // Fetch the review from Firestore when the component mounts
    const fetchReview = async () => {
      try {
        const ratingRef = firebase.firestore().collection("ratings").doc(email);
        const snapshot = await ratingRef.get();
        if (snapshot.exists) {
          const data = snapshot.data();
          setSubmittedReview(data.review); // Set the review fetched from Firestore
          setSubmittedRating(data.rating);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [email]);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require("./User.jpg")} style={styles.profileImage} />
        <Text style={styles.profileName}>{name}</Text>
      </View>
      <Text style={styles.reviewInfo}>
        Reviews are public and include your account and device information.
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
              size={35}
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
      <TouchableOpacity
        style={styles.ratingsButton}
        onPress={() => navigation.navigate("RatingList", { name, email })}
      >
        <Text style={styles.ratingsButtonText}>Ratings and reviews</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="black"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      {submittedRating && (
        <View style={styles.beforeContainer}>
          <Text style={styles.thankMessage}>
          We Greatly Appreciate To Rate Our App.Thanks
          </Text>
          <View style={styles.starContainer}>
            {[...Array(5).keys()].map((star) => (
              <Ionicons
                key={star}
                name={star < submittedRating ? "star" : "star-outline"}
                size={20}
                color={star < submittedRating ? "blue" : "gray"}
              />
            ))}
          </View>
        </View>
      )}
      {submittedReview && (
        <View style={styles.commentItem}>
          <Text style={styles.submittedReviewText}>{submittedReview}</Text>
        </View>
      )}
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
  starContainer: {
    flexDirection: "row",
    marginRight: 10,
    marginTop: 10,
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
  reviewInfo: {
    fontSize: 15,
    color: "#888",
    marginBottom: 5,
  },
  thankMessage:{
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
  beforeContainer: {},
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  reviewInput: {
    height: 80,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 3,
    padding: 10,
    marginBottom: 25,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
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
    fontSize: 15,
    fontWeight: "bold",
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  commentItem: {
    marginBottom: 20,
    marginTop: 10,
  },
  submittedReviewText: {
    fontSize: 15,
  },
});

export default Rating;
