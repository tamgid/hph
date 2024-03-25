import React, { useEffect, useState } from 'react';
import { View,ScrollView, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { firebase } from '../config';
import { Ionicons } from '@expo/vector-icons';

const RatingList = ({ navigation, route }) => {
  const { name, email } = route.params;
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('ratings').onSnapshot((snapshot) => {
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
      const isReactDoc = await firebase.firestore().collection('isReact').doc(email + id).get();
  
      if (!isReactDoc.exists) {
        // User has not reacted yet, update the react count and add the combination to isReact collection
        await firebase.firestore().collection('ratings').doc(id).update({
          likes: firebase.firestore.FieldValue.increment(1)
        });
        await firebase.firestore().collection('isReact').doc(email + id).set({
          userId: email,
          reviewId: id,
          likeOrDislike: 1
        });
      }else{
        const fieldValue = isReactDoc.data().likeOrDislike;
       if(fieldValue==1) {
        // User has already reacted, update the react counts accordingly
        await firebase.firestore().collection('ratings').doc(id).update({
          likes: firebase.firestore.FieldValue.increment(-1),
        });
        await firebase.firestore().collection('isReact').doc(email + id).delete();
        // Optionally, you can display a message indicating that the user has already reacted
        // console.log('You have already reacted to this review.');
      }
      else if(fieldValue==0) {
        // User has already reacted, update the react counts accordingly
        await firebase.firestore().collection('ratings').doc(id).update({
          likes: firebase.firestore.FieldValue.increment(1),
          dislikes: firebase.firestore.FieldValue.increment(-1)
        });
        await firebase.firestore().collection('isReact').doc(email + id).set({
          userId: email,
          reviewId: id,
          likeOrDislike: 1
        });
        // Optionally, you can display a message indicating that the user has already reacted
        // console.log('You have already reacted to this review.');
      }
    }
    } catch (error) {
      // Handle the error here, log it, or perform any necessary actions
      console.error('Error handling like:', error);
    }
  };
  
  const handleDislike = async (id) => {
    try {
      const isReactDoc = await firebase.firestore().collection('isReact').doc(email + id).get();
  
      if (!isReactDoc.exists) {
        // User has not reacted yet, update the react count and add the combination to isReact collection
        await firebase.firestore().collection('ratings').doc(id).update({
          dislikes: firebase.firestore.FieldValue.increment(1)
        });
        await firebase.firestore().collection('isReact').doc(email + id).set({
          userId: email,
          reviewId: id,
          likeOrDislike: 0
        });
      }else{
        const fieldValue = isReactDoc.data().likeOrDislike;
       if(fieldValue==0) {
        // User has already reacted, update the react counts accordingly
        await firebase.firestore().collection('ratings').doc(id).update({
          dislikes: firebase.firestore.FieldValue.increment(-1),
        });
        await firebase.firestore().collection('isReact').doc(email + id).delete();
        // User has already reacted, display a message indicating that the user has already reacted
        // console.log('You have already reacted to this review.');
      }
      else if(fieldValue==1) {
        // User has already reacted, update the react counts accordingly
        await firebase.firestore().collection('ratings').doc(id).update({
          dislikes: firebase.firestore.FieldValue.increment(1),
          likes: firebase.firestore.FieldValue.increment(-1)
        });
        await firebase.firestore().collection('isReact').doc(email + id).set({
          userId: email,
          reviewId: id,
          likeOrDislike: 0
        });
        // User has already reacted, display a message indicating that the user has already reacted
        // console.log('You have already reacted to this review.');
      }
    }
    } catch (error) {
      // Handle the error here, log it, or perform any necessary actions
      console.error('Error handling dislike:', error);
    }
  };
  
  

  return (
    <ScrollView style={styles.container}>
      {ratings.map((rating, index) => (
        <View key={index} style={styles.ratingContainer}>
          <View style={styles.profileContainer}>
            <Image source={require('./User.jpg')} style={styles.profileImage} />
            <Text style={styles.profileName}>{rating.email}</Text>
          </View>
          <View style={styles.ratingInfo}>
            <View style={styles.starContainer}>
              {[...Array(5).keys()].map((star) => (
                <Ionicons
                  key={star}
                  name={star < rating.rating ? 'star' : 'star-outline'}
                  size={20}
                  color={star < rating.rating ? 'blue' : 'gray'}
                />
              ))}
            </View>
            <Text style={styles.dateText}>{rating.date}</Text>
          </View>
          <Text style={styles.reviewText}>{rating.review}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.reactButton} onPress={() => handleLike(rating.id)}>
              <Ionicons name="thumbs-up" size={24} color="blue" />
            </TouchableOpacity>
            <Text>{rating.likes || 0}</Text>
            <TouchableOpacity style={styles.reactButton} onPress={() => handleDislike(rating.id)}>
              <Ionicons name="thumbs-down" size={24} color="red" />
            </TouchableOpacity>
            <Text>{rating.dislikes || 0}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  ratingContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  reviewText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reactButton: {
    marginLeft: 10,
  }
});

export default RatingList;
