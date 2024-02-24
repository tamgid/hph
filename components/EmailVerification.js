import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { firebase } from '../config';
import { Ionicons } from '@expo/vector-icons';

const EmailVerification = ({ navigation, route }) => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { name, username, password, phone, location } = route.params;

  const handleSignUp = async () => {

    if (!email) {
      setErrorMessage('Please provide all the necessary information');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Hide message after 3 seconds
      return;
    }
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('User created:', user);
      const currentDate = new Date();

      // Send email verification
      await user.sendEmailVerification();

      // Update user profile with display name
      await user.updateProfile({ displayName: username });
      
      // Store additional user information in Firestore
      await firebase.firestore().collection('users').doc(user.uid).set({
        name: name,
        email: email,
        password: password,
        username: username,
        phone: phone,
        regDate: currentDate.toISOString(),
        location: location,
        // Add more fields as needed
      });

      setSuccessMessage('User created successfully');
      setEmail('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('Please provide correct information.');
      } else {
        setErrorMessage('Please provide correct email and password.');
      }
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Hide message after 3 seconds
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please provide your email address.</Text>
      <Text style={styles.greetingText}>We will send a verification mail to verify your email.</Text>
      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TouchableOpacity 
        style={styles.signupButton} // Disable button if username is not available
        onPress={handleSignUp} 
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: Dimensions.get('window').height * 0.01,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: Dimensions.get('window').height * 0.05,
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: Dimensions.get('window').height * 0.06,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: Dimensions.get('window').height * 0.06,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  signupButton: {
    marginTop: Dimensions.get('window').height * 0.04,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  loginContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLink: {
    marginLeft: 5,
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default EmailVerification;





