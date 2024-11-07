import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Card } from "react-native";
import { firebase } from "../config"; // Import your Firebase configuration

const History = () => {
  const [historyData, setHistoryData] = useState([]); // State to store the health conditions
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchHealthHistory = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const email = currentUser.email; // Get the email of the current user

          // Fetch documents from healthCondition collection where the email matches
          const querySnapshot = await firebase
            .firestore()
            .collection("healthCondition")
            .where("email", "==", email) // Query based on email field
            .get();

          // Map the query results into an array
          const healthConditions = querySnapshot.docs.map((doc) => doc.data());
          setHistoryData(healthConditions); // Set the fetched data into state
        }
      } catch (error) {
        console.error("Error fetching health history: ", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchHealthHistory();
  }, []);

  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate(); // Converts Firestore timestamp to JS Date object
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; // e.g. "9/25/2024 1:30 PM"
    }
    return "No date available";
  };

  // Render individual card for each health condition document
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Health Condition</Text>
      <Text style={styles.cardText}>Age: {item.age}</Text>
      <Text style={styles.cardText}>
        Number of Major Vessels:{" "}
        {
          item.ca === 0
            ? "None"
            : item.ca === 1
            ? "One"
            : item.ca === 2
            ? "Two"
            : item.ca === 3
            ? "Three"
            : "Unknown" // fallback for any unexpected value
        }
      </Text>
      <Text style={styles.cardText}>
        Serum Cholestoral in mg/dl: {item.chol}
      </Text>
      <Text style={styles.cardText}>
        Chest Pain Type:{" "}
        {
          item.cp === 0
            ? "Typical angina"
            : item.cp === 1
            ? "Atypical angina"
            : item.cp === 2
            ? "Non-Anginal pain"
            : item.cp === 3
            ? "Asymptomatic"
            : "Unknown" // fallback for any unexpected value
        }
      </Text>
      <Text style={styles.cardText}>
        Exercise Induced Angina:{" "}
        {
          item.exang === 1 ? "Yes" : item.exang === 0 ? "No" : "Unknown" // fallback for any unexpected value
        }
      </Text>
      <Text style={styles.cardText}>
        Fasting Blood Sugar: {item.fbs === 1 ? "True" : "False"}
      </Text>
      <Text style={styles.cardText}>
        ST Depression Induced by Exercise: {item.oldpeak}
      </Text>
      <Text style={styles.cardText}>
        Resting ECG:{" "}
        {
          item.restecg === 0
            ? "Normal"
            : item.restecg === 1
            ? "Mild Abnormalities"
            : item.restecg === 2
            ? "Significant Abnormalities"
            : "Unknown" // fallback for any unexpected value
        }
      </Text>
      <Text style={styles.cardText}>
        Sex: {item.sex === 1 ? "Male" : "Female"}
      </Text>
      <Text style={styles.cardText}>
        Slope of the ST Segment:{" "}
        {
          item.slope === 0
            ? "Upsloping"
            : item.slope === 1
            ? "Flat"
            : item.slope === 2
            ? "Downsloping"
            : "Unknown" // fallback for any unexpected value
        }
      </Text>
      <Text style={styles.cardText}>Target: {item.target}</Text>
      <Text style={styles.cardText}>
        Thallium Stress Test:{" "}
        {
          item.thal === 0
            ? "Totally Normal"
            : item.thal === 1
            ? "Normal"
            : item.thal === 2
            ? "Fixed Defect"
            : item.thal === 3
            ? "Reversible Defect"
            : "Unknown" // fallback for any unexpected value
        }
      </Text>
      <Text style={styles.cardText}>
        Maximum Heart Rate Achieved: {item.thalach}
      </Text>
      <Text style={styles.cardText}>
        Timestamp:{" "}
        {item.timestamp ? formatDate(item.timestamp) : "No date available"}
      </Text>
      <Text style={styles.cardText}>
        Resting Blood Pressure: {item.trestbps}
      </Text>
    </View>
  );

  // If loading, show loading text
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // If no history data, show message
  if (historyData.length === 0) {
    return <Text>No history available</Text>;
  }

  return (
    <FlatList
      data={historyData}
      renderItem={renderCard} // Use the renderCard function to display each item
      keyExtractor={(item, index) => index.toString()} // Use index as key (if data doesn't have unique id)
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderColor: "#34b88c", // Accent color on the left side
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow effect
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
});

export default History;
