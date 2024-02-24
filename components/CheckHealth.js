import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const CheckHealth = () => {
  // State for form inputs
  const [sex, setSex] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [bmi, setBMI] = useState("");
  const [smoking, setSmoking] = useState("");
  const [alcoholDrinking, setAlcoholDrinking] = useState("");
  const [stroke, setStroke] = useState("");
  const [physicalHealth, setPhysicalHealth] = useState("");
  const [mentalHealth, setMentalHealth] = useState("");
  const [diffWalking, setDiffWalking] = useState("");
  const [race, setRace] = useState("");
  const [diabetic, setDiabetic] = useState("");
  const [physicalActivity, setPhysicalActivity] = useState("");
  const [genHealth, setGenHealth] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [asthma, setAsthma] = useState("");
  const [kidneyDisease, setKidneyDisease] = useState("");
  const [skinCancer, setSkinCancer] = useState("");

  const handlePredict = () => {
    // Logic for health prediction based on the form data
    // You can implement your prediction logic here
    // For now, let's just log the form data
    console.log({
      sex,
      ageCategory,
      bmi,
      smoking,
      alcoholDrinking,
      stroke,
      physicalHealth,
      mentalHealth,
      diffWalking,
      race,
      diabetic,
      physicalActivity,
      genHealth,
      sleepTime,
      asthma,
      kidneyDisease,
      skinCancer,
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
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>

        {/* Age Category */}
        <Picker
          selectedValue={ageCategory}
          onValueChange={(itemValue) => setAgeCategory(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Age Category" value="" />
          <Picker.Item label="18-24" value="18-24" />
          <Picker.Item label="25-29" value="25-29" />
          <Picker.Item label="30-34" value="30-34" />
          <Picker.Item label="35-39" value="35-39" />
          <Picker.Item label="40-44" value="40-44" />
          <Picker.Item label="45-49" value="45-49" />
          <Picker.Item label="50-54" value="50-54" />
          <Picker.Item label="55-59" value="55-59" />
          <Picker.Item label="60-64" value="60-64" />
          <Picker.Item label="65-69" value="65-69" />
          <Picker.Item label="70-74" value="70-74" />
          <Picker.Item label="75-79" value="75-79" />
          <Picker.Item label="80 or older" value="80 or older" />
        </Picker>

        {/* Smoking */}
        <Picker
          selectedValue={smoking}
          onValueChange={(itemValue) => setSmoking(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you smoke?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={alcoholDrinking}
          onValueChange={(itemValue) => setAlcoholDrinking(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you drink alcohol?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={stroke}
          onValueChange={(itemValue) => setStroke(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you stroke?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={diffWalking}
          onValueChange={(itemValue) => setDiffWalking(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you have difficulty of walking?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={race}
          onValueChange={(itemValue) => setRace(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Race?" value="" />
          <Picker.Item label="White" value="White" />
          <Picker.Item label="Black" value="Black" />
          <Picker.Item
            label="American Indian/Alaskan Native"
            value="American Indian/Alaskan Native"
          />
          <Picker.Item label="Hispanic" value="Hispanic" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        <Picker
          selectedValue={diabetic}
          onValueChange={(itemValue) => setDiabetic(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you have diabetics?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
          <Picker.Item
            label="borderline diabetes"
            value="borderline diabetes"
          />
        </Picker>

        <Picker
          selectedValue={physicalActivity}
          onValueChange={(itemValue) => setPhysicalActivity(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you perform Physical Activity?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={genHealth}
          onValueChange={(itemValue) => setGenHealth(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="What is general health condition?" value="" />
          <Picker.Item label="Very good" value="Very good" />
          <Picker.Item label="Fair" value="Fair" />
          <Picker.Item label="Good" value="Good" />
          <Picker.Item label="Poor" value="Poor" />
          <Picker.Item label="Excellent" value="Excellent" />
        </Picker>

        <Picker
          selectedValue={asthma}
          onValueChange={(itemValue) => setAsthma(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you have asthma?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={kidneyDisease}
          onValueChange={(itemValue) => setKidneyDisease(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you have kidney disease?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        <Picker
          selectedValue={skinCancer}
          onValueChange={(itemValue) => setSkinCancer(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Do you have skin cancer?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>

        {/* BMI */}
        <TextInput
          placeholder="BMI"
          value={bmi}
          onChangeText={(text) => setBMI(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Sleep Time"
          value={sleepTime}
          onChangeText={(text) => setSleepTime(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Physical Health"
          value={physicalHealth}
          onChangeText={(text) => setPhysicalHealth(text)}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Mental Health"
          value={mentalHealth}
          onChangeText={(text) => setMentalHealth(text)}
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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
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
    marginBottom: 230,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CheckHealth;
