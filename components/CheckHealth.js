import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const CheckHealth = () => {
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

  const handlePredict = () => {
    // Logic for health prediction based on the form data
    // You can implement your prediction logic here
    // For now, let's just log the form data
    console.log({
      age,
      sex,
      cp,
      trestbps,
      chol,
      fbs,
      restecg,
      thalach,
      exang,
      oldpeak,
      slope,
      ca,
      thal,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Health Assessment</Text>
      <Text style={styles.introText}>
        Provide essential health information to tailor predictions. Let's get
        started!
      </Text>

      {/* Form Inputs */}
      <ScrollView style={styles.formContainer}>

        {/* Sex */}
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Sex" value="" />
          <Picker.Item label="Male" value="1" />
          <Picker.Item label="Female" value="0" />
        </Picker>

        {/* Chest Pain Type */}
        <Picker
          selectedValue={cp}
          onValueChange={(itemValue) => setCp(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Chest Pain type?" value="" />
          <Picker.Item label="Typical angina" value="0" />
          <Picker.Item label="Atypical angina" value="1" />
          <Picker.Item label="Non-Anginal pain" value="2" />
          <Picker.Item label="Asymptomatic" value="3" />
        </Picker>

        <Picker
          selectedValue={fbs}
          onValueChange={(itemValue) => setFbs(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Fasting Blood Sugar? 120 mg/dl" value="" />
          <Picker.Item label="True" value="1" />
          <Picker.Item label="False" value="0" />
        </Picker>

        <Picker
          selectedValue={restecg}
          onValueChange={(itemValue) => setRestecg(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Resting Electrocardiographic results?" value="" />
          <Picker.Item label="Normal" value="0" />
          <Picker.Item label="Mild to Moderate Abnormalities" value="1" />
          <Picker.Item label="Significant Abnormalities" value="2" />
        </Picker>

        <Picker
          selectedValue={exang}
          onValueChange={(itemValue) => setExang(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Exercise Induced Angina?" value="" />
          <Picker.Item label="Yes" value="1" />
          <Picker.Item label="No" value="0" />
        </Picker>

        <Picker
          selectedValue={slope}
          onValueChange={(itemValue) => setSlope(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Slope of the Peak Exercise ST Segment" value="" />
          <Picker.Item label="Upsloping (Positive slope)" value="0" />
          <Picker.Item label="Flat (Flat ST segment)" value="1" />
          <Picker.Item label="Downsloping (Negative slope)" value="2" />
        </Picker>

        <Picker
          selectedValue={ca}
          onValueChange={(itemValue) => setCa(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Number of major Vessels" value="" />
          <Picker.Item label="No major vessels" value="0" />
          <Picker.Item label="One major vessel" value="1" />
          <Picker.Item label="Two major vessels" value="2" />
          <Picker.Item label="Three major vessels" value="3" />
        </Picker>

        <Picker
          selectedValue={thal}
          onValueChange={(itemValue) => setThal(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Thallium Stress Test" value="" />
          <Picker.Item label="Totally normal" value="0" />
          <Picker.Item label="Normal" value="1" />
          <Picker.Item label="Fixed Defect" value="2" />
          <Picker.Item label="Reversable Defect" value="3" />
        </Picker>

        {/* Age */}
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={(text) => setAge(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Resting Blood Pressure */}
        <TextInput
          placeholder="Resting Blood Pressure"
          value={trestbps}
          onChangeText={(text) => setTrestbps(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Serum Cholestoral in mg/dl */}
        <TextInput
          placeholder="Serum Cholestoral in mg/dl"
          value={chol}
          onChangeText={(text) => setChol(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Maximum Heart rate Achieved"
          value={thalach}
          onChangeText={(text) => setThalach(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="ST depression induced by exercise relative to rest"
          value={oldpeak}
          onChangeText={(text) => setOldpeak(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Information Message */}
        <Text style={styles.infoMessage}>
          ***I hope your provided all the information are valid.
        </Text>

        {/* Predict Button */}
        <TouchableOpacity style={styles.predictButton} onPress={handlePredict}>
          <Text style={styles.buttonText}>Predict</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  introText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
    fontWeight: "bold",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  infoMessage: {
    marginTop: 10,
    marginBottom: 10,
    color: "#555",
    fontStyle: "italic",
  },
  predictButton: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CheckHealth;
