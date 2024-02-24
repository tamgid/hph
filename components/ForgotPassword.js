import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { firebase } from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleContinue = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setSuccessMessage('Password reset instructions sent to your email.');
      setEmail('');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset your password</Text>

      <Text style={styles.description}>
        Enter your email address and we will send you instructions to reset your password
      </Text>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
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
    textAlign: 'center'
  },
  description: {
    fontSize: 17,
    color: '#555',
    marginBottom: Dimensions.get('window').height * 0.04,
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  input: {
    height: Dimensions.get('window').height * 0.06,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: Dimensions.get('window').height * 0.02,
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ForgotPassword;
