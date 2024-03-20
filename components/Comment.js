import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../config';

const Comment = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    try {
      const db = firebase.firestore();
      const commentRef = db.collection('comments').doc();
      await commentRef.set({
        name: name,
        age: age,
        address: address,
        comment: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Comment submitted successfully!');
      // Clear input fields
      setName('');
      setAge('');
      setAddress('');
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={text => setAge(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <TextInput
        style={[styles.input, styles.commentInput]}
        placeholder="Comment"
        multiline
        value={comment}
        onChangeText={text => setComment(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayButton} onPress={() => navigation.navigate('CommentList')}>
          <Text style={styles.buttonText}>Display</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  commentInput: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 5,
    width: '48%', // Adjust button width as needed
  },
  displayButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 5,
    width: '48%', // Adjust button width as needed
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Comment;
