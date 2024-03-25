import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const HealthPredict = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  // Event handler for text box 1
  const handleText1Change = (value) => {
    setText1(value);
    // Update text box 2 based on input from text box 1
    setText2(value.toUpperCase());
  };

  // Event handler for text box 2
  const handleText2Change = (value) => {
    setText2(value);
    // Update text box 1 based on input from text box 2
    setText1(value.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <TextInput
          value={text2}
          onChangeText={handleText2Change}
          placeholder="Text 1"
          style={styles.textInput}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          value={text1}
          onChangeText={handleText1Change}
          placeholder="Text 2"
          style={styles.textInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space evenly between items
  },
  textInputContainer: {
    flex: 1, // Take equal space
    marginRight: 10, // Margin between text inputs
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});

export default HealthPredict;
