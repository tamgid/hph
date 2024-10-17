import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Modal,
} from "react-native";
import { RadioButton, Text as PaperText } from "react-native-paper";
import { firebase } from "../config";

const CheckHealth = ({ route, navigation }) => {
  // State for form inputs
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [cp, setCp] = useState("");
  const [trestbps, setTrestbps] = useState("");
  const [chol, setChol] = useState("");
  const [fbs, setFbs] = useState("");
  const [restecg, setRestecg] = useState("");
  const [thalach, setThalach] = useState("");
  const [exang, setExang] = useState("");
  const [oldpeak, setOldpeak] = useState("");
  const [slope, setSlope] = useState("");
  const [ca, setCa] = useState("");
  const [thal, setThal] = useState("");

  const handlePredict = async () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      Alert.alert("Error", "No user is currently logged in.");
      return;
    }
    const email = user.email;
    const timestamp = new Date();

    const apiData = {
      age: parseInt(age),
      sex: parseInt(sex),
      cp: parseInt(cp),
      trestbps: parseInt(trestbps),
      chol: parseInt(chol),
      fbs: parseInt(fbs),
      restecg: parseInt(restecg),
      thalach: parseInt(thalach),
      exang: parseInt(exang),
      oldpeak: parseFloat(oldpeak),
      slope: parseInt(slope),
      ca: parseInt(ca),
      thal: parseInt(thal),
    };

    try {
      const response = await fetch(
        "https://check-your-heart-condition.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update firebaseData to include the prediction result
        const firebaseData = {
          ...apiData,
          email,
          timestamp,
          target: result.prediction, // Add this line to store the prediction result
        };

        // Save data to Firestore
        await firebase
          .firestore()
          .collection("healthCondition")
          .add(firebaseData);

        let message = "";
        let color = "";
        if (result.prediction === "The person has heart disease") {
          message =
            "Sorry! Your heart health needs attention.";
          color = "red";
        } else if (
          result.prediction === "The person does not have heart disease"
        ) {
          message = "Congratulations! You are free from heart disease.";
          color = "green";
        } else {
          message = "Unable to determine your heart condition.";
          color = "orange";
        }

        // Navigate to PredictionResult screen with result data
        navigation.navigate("PredictionResult", {
          predictionMessage: message,
          messageColor: color,
        });
      } else {
        Alert.alert("Error", "Something went wrong with the prediction.");
      }
      resetFields();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "There was a problem saving your data or making the prediction."
      );
    }
  };

  const resetFields = () => {
    setAge("");
    setSex("");
    setCp("");
    setTrestbps("");
    setChol("");
    setFbs("");
    setRestecg("");
    setThalach("");
    setExang("");
    setOldpeak("");
    setSlope("");
    setCa("");
    setThal("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>HPH</Text>
      <Text style={styles.introText}>Heart Disease Prediction</Text>

      <View style={styles.radioContainer}>
        {/* Sex */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Sex</PaperText>
          <RadioButton.Group
            onValueChange={(value) => setSex(value)}
            value={sex}
          >
            <RadioButton.Item
              label="Male"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Female"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Chest Pain Type */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Chest Pain Type</PaperText>
          <RadioButton.Group onValueChange={(value) => setCp(value)} value={cp}>
            <RadioButton.Item
              label="Typical angina"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Atypical angina"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Non-Anginal pain"
              value="2"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Asymptomatic"
              value="3"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Fasting Blood Sugar */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>
            Fasting Blood Sugar &gt; 120 mg/dl
          </PaperText>
          <RadioButton.Group
            onValueChange={(value) => setFbs(value)}
            value={fbs}
          >
            <RadioButton.Item
              label="True"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="False"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Resting ECG */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Resting ECG</PaperText>
          <RadioButton.Group
            onValueChange={(value) => setRestecg(value)}
            value={restecg}
          >
            <RadioButton.Item
              label="Normal"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Mild Abnormalities"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Significant Abnormalities"
              value="2"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Exercise Induced Angina */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Exercise Induced Angina</PaperText>
          <RadioButton.Group
            onValueChange={(value) => setExang(value)}
            value={exang}
          >
            <RadioButton.Item
              label="Yes"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="No"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Slope of the Peak Exercise ST Segment */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Slope of the ST Segment</PaperText>
          <RadioButton.Group
            onValueChange={(value) => setSlope(value)}
            value={slope}
          >
            <RadioButton.Item
              label="Upsloping"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Flat"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Downsloping"
              value="2"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Number of Major Vessels */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Number of Major Vessels</PaperText>
          <RadioButton.Group onValueChange={(value) => setCa(value)} value={ca}>
            <RadioButton.Item
              label="None"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="One"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Two"
              value="2"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Three"
              value="3"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>

        {/* Thallium Stress Test */}
        <View style={styles.radioItem}>
          <PaperText style={styles.label}>Thallium Stress Test</PaperText>
          <RadioButton.Group
            onValueChange={(value) => setThal(value)}
            value={thal}
          >
            <RadioButton.Item
              label="Totally Normal"
              value="0"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Normal"
              value="1"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Fixed Defect"
              value="2"
              labelStyle={styles.radioItemLabel}
            />
            <RadioButton.Item
              label="Reversible Defect"
              value="3"
              labelStyle={styles.radioItemLabel}
            />
          </RadioButton.Group>
        </View>
      </View>

      <View style={styles.textInputContainer}>
        {/* Age */}
        <View>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            value={age}
            onChangeText={(text) => setAge(text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Resting Blood Pressure */}
        <View>
          <Text style={styles.inputLabel}>Resting Blood Pressure</Text>
          <TextInput
            value={trestbps}
            onChangeText={(text) => setTrestbps(text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Serum Cholestoral in mg/dl */}
        <View>
          <Text style={styles.inputLabel}>Serum Cholestoral in mg/dl</Text>
          <TextInput
            value={chol}
            onChangeText={(text) => setChol(text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Maximum Heart Rate Achieved */}
        <View>
          <Text style={styles.inputLabel}>Maximum Heart Rate Achieved</Text>
          <TextInput
            value={thalach}
            onChangeText={(text) => setThalach(text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* ST Depression Induced by Exercise Relative to Rest */}
        <View>
          <Text style={styles.inputLabel}>
            ST Depression Induced by Exercise
          </Text>
          <TextInput
            value={oldpeak}
            onChangeText={(text) => setOldpeak(text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.predictButton} onPress={handlePredict}>
          <Text style={styles.buttonText}>Predict</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eeeeee", // Light background for better readability
  },
  heading: {
    fontSize: 25, // Larger font size for prominence
    fontWeight: "700", // Slightly less bold for a cleaner look
    color: "#34b88c", // Darker color for better contrast
    textAlign: "center", // Center-align for a balanced look
  },
  introText: {
    fontSize: 17,
    color: "#2d799c",
    marginBottom: 25,
    fontWeight: "400",
    textAlign: "center",
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: "#dcdcdc", // Light gray color for the border
    paddingBottom: 10, // Space between text and border
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  radioItemLabel: {
    fontSize: 14, // Adjust the size as needed
    color: "#333", // Optionally adjust the color
  },
  textInputContainer: {
    marginBottom: 80,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  predictButton: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 11,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});

export default CheckHealth;
