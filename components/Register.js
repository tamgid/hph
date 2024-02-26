import React, { useState, useEffect } from 'react';
import { View, Text, Platform, TextInput, Pressable, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { firebase } from '../config';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if(type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if(Platform.OS === "android"){
        toggleDatepicker();
        setDateOfBirth(currentDate.toDateString());
      }
    }else{
      toggleDatepicker();
    }
  };
  

  useEffect(() => {
    // Function to check username availability when username changes
    checkUsernameAvailability();
  }, [username]);

  const checkUsernameAvailability = async () => {
    if (username.trim() === '') {
      // Skip check if username is empty
      setIsUsernameAvailable(true);
      return;
    }
    try {
      const usernameSnapshot = await firebase.firestore().collection('users').where('username', '==', username).get();
      if (usernameSnapshot.empty) {
        // Username is available
        setIsUsernameAvailable(true);
      } else {
        // Username already exists
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setIsUsernameAvailable(true); // Reset to true in case of error
    }
  };


  const handleSignUp = async () => {
    // Check if username is available before proceeding with registration
    if (!isUsernameAvailable) {
      setErrorMessage('Username is already taken');
      return;
    }
    if (!name || !password || !phone || !username  || !location || !dateOfBirth) {
      setErrorMessage('Please provide all the necessary information');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Hide message after 3 seconds
      return;
    }
    try {
      navigation.navigate("EmailVerification", {
        name,
        username,
        password,
        phone,
        location,
        dateOfBirth,
      });

      setName('');
      setPassword('');
      setUsername('');
      setPhone('');
      setLocation('');
      setDateOfBirth('');

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Let's Register Account</Text>
      <Text style={styles.greetingText}>Hello user, you have a grateful journey</Text>
      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        /> */}
        <TextInput
          style={[styles.input, !isUsernameAvailable && styles.inputError]} // Apply error style if username is not available
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        {!isUsernameAvailable && <Text style={styles.errorText}>Username is already taken</Text>}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIconContainer} onPress={togglePasswordVisibility}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />

        <View>
          {showPicker && (
            <DateTimePicker
            mode="date"
            display='spinner'
            value={date}
            onChange={onChange}
          />
          )}

          {!showPicker && (
            <Pressable
            onPress={toggleDatepicker}
          >
            <TextInput
              style={styles.input}
              placeholder='Date of Birth'
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholderTextColor="#11182744"
              editable={false}
            />
          </Pressable>
          )}
        </View>

        <TouchableOpacity 
        style={[styles.signupButton, !isUsernameAvailable && styles.disabledButton]} // Disable button if username is not available
        onPress={handleSignUp} 
        disabled={!isUsernameAvailable} // Disable button if username is not available
      >
        <Text style={styles.signupButtonText}>Next</Text>
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

export default Register;
