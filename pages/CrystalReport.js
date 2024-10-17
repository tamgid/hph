import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { firebase } from '../config'; // Adjust this path to your Firebase config
import HeartDiseaseChart from '../components/HeartDiseaseChart'; // Adjust the import path as necessary

const CrystalReport = () => {
  const [heartDiseaseCount, setHeartDiseaseCount] = useState(0);
  const [noHeartDiseaseCount, setNoHeartDiseaseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthConditionCollection = firebase.firestore().collection('healthCondition');
        const snapshot = await healthConditionCollection.get();

        let heartDiseaseCounter = 0;
        let noHeartDiseaseCounter = 0;

        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.target === "The person has heart disease") {
            heartDiseaseCounter += 1;
          } else if (data.target === "The person does not have heart disease") {
            noHeartDiseaseCounter += 1;
          }
        });

        setHeartDiseaseCount(heartDiseaseCounter);
        setNoHeartDiseaseCount(noHeartDiseaseCounter);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Fetching Heart Disease Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Disease Statistics</Text>
      <View style={styles.chartContainer}>
        <HeartDiseaseChart 
          heartDiseaseCount={heartDiseaseCount} 
          noHeartDiseaseCount={noHeartDiseaseCount} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default CrystalReport;
