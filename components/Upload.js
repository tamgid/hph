import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { firebase } from '../config';

const Upload = () => {
  const [uploadStatus, setUploadStatus] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.cancelled) {
        await uploadFile(result.uri);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const uploadFile = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.split('/').pop();
      const storageRef = firebase.storage().ref().child(filename);
      await storageRef.put(blob);
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select File" onPress={pickDocument} />
      <Text style={styles.uploadStatus}>{uploadStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadStatus: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default Upload;
