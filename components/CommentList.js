import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const CommentList = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments data from Firestore when component mounts
    const fetchComments = async () => {
      try {
        const db = firebase.firestore();
        const commentsSnapshot = await db.collection('comments').get();
        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();

    // Unsubscribe from Firestore listener when component unmounts
    return () => {};
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Comments</Text>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text>Name: {item.name}</Text>
            <Text>Age: {item.age}</Text>
            <Text>Address: {item.address}</Text>
            <Text>Comment: {item.comment}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default CommentList;
