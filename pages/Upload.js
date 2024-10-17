import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // File icons

const colors = ["#44c0fe", "#ff9800", "#4caf50"]; // Blue, Orange, Green
const { width, height } = Dimensions.get("window");

const Upload = ({ navigation, route }) => {
  const { email } = route.params;
  const [files, setFiles] = useState([]);
  const [imageName, setImageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingFile, setEditingFile] = useState(null); // Track the file being edited
  const [newFileName, setNewFileName] = useState(""); // For the new file name
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("uploads")
      .where("email", "==", email)
      .onSnapshot((snapshot) => {
        const uploads = snapshot.docs.map((doc) => ({
          id: doc.id, // Store document ID for updating
          fileUrl: doc.data().fileUrl,
          relativeFileName: doc.data().relativeFileName,
          timestamp: doc.data().timestamp,
        }));
        setFiles(uploads);
      });

    return () => unsubscribe();
  }, [email]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  const uploadImage = async (uri) => {
    const user = firebase.auth().currentUser;
    const response = await fetch(uri);
    const blob = await response.blob();

    const relativeFileName = imageName ? `${imageName}.jpg` : `Untitled.jpg`;

    const storageRef = firebase
      .storage()
      .ref(`uploads/${user.uid}/${relativeFileName}`);

    // Set the content type explicitly
    const metadata = {
      contentType: "image/jpeg", // Adjust based on the file type
    };

    await storageRef.put(blob, metadata);

    const downloadURL = await storageRef.getDownloadURL();
    return { downloadURL, relativeFileName };
  };

  const saveUploadDetailsToFirestore = async (
    downloadURL,
    relativeFileName
  ) => {
    const user = firebase.auth().currentUser;

    if (user) {
      const { uid } = user;

      await firebase.firestore().collection("uploads").add({
        uid: uid,
        email: email,
        relativeFileName: relativeFileName,
        fileUrl: downloadURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      console.error("No authenticated user found!");
    }
  };

  const handleImagePickAndUpload = async () => {
    if (imageName.length > 30) {
      setErrorMessage("Image name must be 30 characters or less.");
      return;
    }

    try {
      const imageUri = await pickImage();
      if (imageUri) {
        const { downloadURL, relativeFileName } = await uploadImage(imageUri);
        await saveUploadDetailsToFirestore(downloadURL, relativeFileName);
        alert("Image uploaded successfully!");
        setImageName("");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error picking or uploading image:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate(); // Converts Firestore timestamp to JS Date object
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; // e.g. "9/25/2024 1:30 PM"
    }
    return "No date available";
  };

  const openEditModal = (file) => {
    setEditingFile(file);
    setNewFileName(file.relativeFileName);
    setModalVisible(true);
  };

  const handleRenameFile = async () => {
    if (editingFile) {
      const oldFilePath = `uploads/${firebase.auth().currentUser.uid}/${
        editingFile.relativeFileName
      }`;
      const newFilePath = `uploads/${
        firebase.auth().currentUser.uid
      }/${newFileName}`;

      const oldFileRef = firebase.storage().ref(oldFilePath);
      const newFileRef = firebase.storage().ref(newFilePath);

      try {
        // Fetch the old file as a Blob
        const oldFileBlob = await oldFileRef
          .getDownloadURL()
          .then((url) => fetch(url).then((res) => res.blob()));

        // Set the metadata for the new file
        const metadata = {
          contentType: "image/jpeg", // or the appropriate type
        };

        // Upload the Blob to the new path with the metadata
        await newFileRef.put(oldFileBlob, metadata);

        // Delete the old file
        await oldFileRef.delete();

        // Update Firestore with the new file name and URL
        await firebase
          .firestore()
          .collection("uploads")
          .doc(editingFile.id)
          .update({
            relativeFileName: newFileName,
            fileUrl: await newFileRef.getDownloadURL(), // Update with new file URL
          });

        setModalVisible(false);
        setEditingFile(null);
        setNewFileName("");
      } catch (error) {
        console.error("Error renaming file:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.filesContainer}>
        {files.length > 0 ? (
          files.map((file, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.fileItem}
                onPress={() =>
                  navigation.navigate("FullScreenImage", {
                    imageUri: file.fileUrl,
                  })
                }
                onLongPress={() => openEditModal(file)} // Open edit modal on long press
              >
                <MaterialCommunityIcons
                  name="file-document"
                  size={45}
                  color={colors[index % colors.length]}
                />

                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.relativeFileName}</Text>
                  <Text style={styles.fileTimestamp}>
                    {file.timestamp
                      ? formatDate(file.timestamp)
                      : "No date available"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => openEditModal(file)}
                ></TouchableOpacity>
              </TouchableOpacity>

              <View style={styles.separator} />
            </View>
          ))
        ) : (
          <Text>No files uploaded yet.</Text>
        )}
      </ScrollView>

      <View style={styles.fixedContainer}>
        <TextInput
          placeholder="Enter image name (max 30 characters)"
          value={imageName}
          onChangeText={(text) => {
            if (text.length <= 30) {
              setImageName(text);
              setErrorMessage("");
            }
          }}
          style={styles.input}
          maxLength={30}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleImagePickAndUpload}
        >
          <Text style={styles.buttonText}>Choose File</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for renaming file */}
      {/* Modal for renaming file */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename File</Text>
            <TextInput
              value={newFileName}
              onChangeText={setNewFileName}
              style={styles.modalInput}
            />
            <View style={styles.separatorRename} />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton]} // Optionally, add a color for the Cancel button
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRenameFile}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
  },
  filesContainer: {
    paddingBottom: 100,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
  },
  fileInfo: {
    marginLeft: width * 0.02,
    flex: 1,
  },
  fileName: {
    fontSize: 15,
  },
  fileTimestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginLeft: width * 0.163,
  },
  fixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#44c0fe",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorText: { color: "red", marginTop: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  modalInput: {
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginLeft: width * 0.05,
  },
  separatorRename: {
    height: 1,
    backgroundColor: "#ccc",
    marginLeft: width * 0.08,
    backgroundColor: '#58b489',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#eeeeee',
    borderBottomLeftRadius: 10, // Keep bottom left rounded
    borderBottomRightRadius: 10, // Keep bottom right rounded
    borderTopLeftRadius: 0, // Remove top left rounding
    borderTopRightRadius: 0, // Remove top right rounding
  },
  modalButton: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: { color: "#58b489", fontWeight: "bold", fontSize: 16 },
});


export default Upload;
