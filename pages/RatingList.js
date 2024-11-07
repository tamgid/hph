import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { firebase } from "../config";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Import the Rating component
import Rating from "../components/Rating";

const { width, height } = Dimensions.get("window");

const RatingList = ({ navigation, route }) => {
  const { name, email } = route.params;
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("ratings")
      .onSnapshot((snapshot) => {
        const ratingList = [];
        snapshot.forEach((doc) => {
          ratingList.push({ id: doc.id, ...doc.data() });
        });
        setRatings(ratingList);
      });

    return () => unsubscribe();
  }, []);

  const handleLike = async (id) => {
    try {
      const isReactDoc = await firebase
        .firestore()
        .collection("isReact")
        .doc(email + id)
        .get();

      if (!isReactDoc.exists) {
        // User has not reacted yet, update the react count and add the combination to isReact collection
        await firebase
          .firestore()
          .collection("ratings")
          .doc(id)
          .update({
            likes: firebase.firestore.FieldValue.increment(1),
          });
        await firebase
          .firestore()
          .collection("isReact")
          .doc(email + id)
          .set({
            userId: email,
            reviewId: id,
            likeOrDislike: 1,
          });
      } else {
        const fieldValue = isReactDoc.data().likeOrDislike;
        if (fieldValue == 1) {
          // User has already reacted, update the react counts accordingly
          await firebase
            .firestore()
            .collection("ratings")
            .doc(id)
            .update({
              likes: firebase.firestore.FieldValue.increment(-1),
            });
          await firebase
            .firestore()
            .collection("isReact")
            .doc(email + id)
            .delete();
          // Optionally, you can display a message indicating that the user has already reacted
          // console.log('You have already reacted to this review.');
        } else if (fieldValue == 0) {
          // User has already reacted, update the react counts accordingly
          await firebase
            .firestore()
            .collection("ratings")
            .doc(id)
            .update({
              likes: firebase.firestore.FieldValue.increment(1),
              dislikes: firebase.firestore.FieldValue.increment(-1),
            });
          await firebase
            .firestore()
            .collection("isReact")
            .doc(email + id)
            .set({
              userId: email,
              reviewId: id,
              likeOrDislike: 1,
            });
          // Optionally, you can display a message indicating that the user has already reacted
          // console.log('You have already reacted to this review.');
        }
      }
    } catch (error) {
      // Handle the error here, log it, or perform any necessary actions
      console.error("Error handling like:", error);
    }
  };

  const handleDislike = async (id) => {
    try {
      const isReactDoc = await firebase
        .firestore()
        .collection("isReact")
        .doc(email + id)
        .get();

      if (!isReactDoc.exists) {
        // User has not reacted yet, update the react count and add the combination to isReact collection
        await firebase
          .firestore()
          .collection("ratings")
          .doc(id)
          .update({
            dislikes: firebase.firestore.FieldValue.increment(1),
          });
        await firebase
          .firestore()
          .collection("isReact")
          .doc(email + id)
          .set({
            userId: email,
            reviewId: id,
            likeOrDislike: 0,
          });
      } else {
        const fieldValue = isReactDoc.data().likeOrDislike;
        if (fieldValue == 0) {
          // User has already reacted, update the react counts accordingly
          await firebase
            .firestore()
            .collection("ratings")
            .doc(id)
            .update({
              dislikes: firebase.firestore.FieldValue.increment(-1),
            });
          await firebase
            .firestore()
            .collection("isReact")
            .doc(email + id)
            .delete();
          // User has already reacted, display a message indicating that the user has already reacted
          // console.log('You have already reacted to this review.');
        } else if (fieldValue == 1) {
          // User has already reacted, update the react counts accordingly
          await firebase
            .firestore()
            .collection("ratings")
            .doc(id)
            .update({
              dislikes: firebase.firestore.FieldValue.increment(1),
              likes: firebase.firestore.FieldValue.increment(-1),
            });
          await firebase
            .firestore()
            .collection("isReact")
            .doc(email + id)
            .set({
              userId: email,
              reviewId: id,
              likeOrDislike: 0,
            });
          // User has already reacted, display a message indicating that the user has already reacted
          // console.log('You have already reacted to this review.');
        }
      }
    } catch (error) {
      // Handle the error here, log it, or perform any necessary actions
      console.error("Error handling dislike:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate(); // Converts Firestore timestamp to JS Date object
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; // e.g. "9/25/2024 1:30 PM"
    }
    return "No date available";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.upContainer}>
        {/* Render the Rating component */}
        <Rating navigation={navigation} route={route} />
      </View>
      <View style={styles.downContainer}>
        {ratings.map((rating, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.ratingContainer}>
              <View style={styles.profileContainer}>
                <Image
                  source={
                    rating.profileImage
                      ? { uri: rating.profileImage }
                      : require("../image/User.jpg")
                  }
                  style={styles.profileImage}
                />

                <Text style={styles.profileName}>{rating.name}</Text>
              </View>
              <View style={styles.ratingInfo}>
                <View style={styles.starContainer}>
                  {[...Array(5).keys()].map((star) => (
                    <Ionicons
                      key={star}
                      name={star < rating.rating ? "star" : "star-outline"}
                      size={20}
                      color={star < rating.rating ? "#01875f" : "#49cea2"}
                    />
                  ))}
                </View>
                <Text style={styles.dateText}>{rating.timestamp ? formatDate(rating.timestamp) : "No date available"}</Text>
              </View>
              <Text style={styles.reviewText}>{rating.review}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleLike(rating.id)}>
                  <MaterialIcons name="thumb-up" size={24} color="#34b88c" />
                </TouchableOpacity>
                <Text>{rating.likes || 0}</Text>
                <TouchableOpacity
                  style={styles.reactButton}
                  onPress={() => handleDislike(rating.id)}
                >
                  <MaterialIcons name="thumb-down" size={24} color="#f44336" />
                </TouchableOpacity>
                <Text>{rating.dislikes || 0}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  downContainer: {
    padding: 20,
    backgroundColor: "#eeeeee",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  ratingContainer: {
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  reviewText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  reactButton: {
    marginLeft: 15,
  },
});

export default RatingList;
