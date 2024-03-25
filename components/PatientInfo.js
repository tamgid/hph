import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { firebase } from "../config";

const PatientInfo = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [originalPatients, setOriginalPatients] = useState([]);

  useEffect(() => {
    // Fetch all documents from the users collection
    const fetchUserData = async () => {
      try {
        const usersRef = firebase.firestore().collection("users");
        const snapshot = await usersRef.get();
        const userData = [];

        for (const doc of snapshot.docs) {
          const userDataItem = doc.data();
          const healthData = await fetchHealthCondition(doc.data().email);
          const updatedPatient = {
            ...userDataItem,
            age: healthData?.age || "",
            sex: healthData?.sex || "",
            healthCondition: healthData?.healthCondition || "",
            email: healthData?.email || "",
            lastVisit: healthData?.lastVisit || "",
          };
          userData.push(updatedPatient);
        }

        setPatients(userData);
        setOriginalPatients(userData); // Save original data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchHealthCondition = async (email) => {
    try {
      const healthConditionRef = firebase
        .firestore()
        .collection("healthCondition");
      const snapshot = await healthConditionRef
        .where("email", "==", email)
        .get();
      const healthData = snapshot.docs.map((doc) => doc.data())[0]; // Assuming only one health condition per user
      return healthData;
    } catch (error) {
      console.error("Error fetching health condition data:", error);
      return null;
    }
  };

  const renderPatientItem = ({ item }) => (
    <View style={styles.patientItem}>
      <Text>{item.name}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => handleMorePress(item)}
      >
        <Text>More</Text>
      </TouchableOpacity>
    </View>
  );

  const handleMorePress = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const handleSearch = () => {
    // Filter patients based on search query
    const filteredPatients = originalPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPatients(filteredPatients);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPatients(originalPatients); // Reset patients to original data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Patient Information</Text>
      <View style={styles.filterContainer}>
        <Text>Show:</Text>
        <TextInput
          style={styles.dropdown}
          value={String(perPage)}
          onChangeText={(value) => setPerPage(Number(value))}
          keyboardType="numeric"
        />
        <Text>Entries </Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchQuery ? handleSearch : handleClearSearch}
        >
          <Text>{searchQuery ? "Search" : "Clear"}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={patients.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
        )}
        renderItem={renderPatientItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Text>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage * perPage >= patients.length && styles.disabledButton,
          ]}
          onPress={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(patients.length / perPage))
            )
          }
          disabled={currentPage * perPage >= patients.length}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Name: {selectedPatient?.name}</Text>
            <Text>Email: {selectedPatient?.email}</Text>
            <Text>Age: {selectedPatient?.age}</Text>
            <Text>Sex: {selectedPatient?.sex === 1 ? 'Male' : 'Female'}</Text>
            <Text>Division: {selectedPatient?.division}</Text>
            <Text>District: {selectedPatient?.district}</Text>
            <Text>Health Condition: {selectedPatient?.healthCondition}</Text>
            <Text>Last Visit: {selectedPatient?.lastVisit}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdown: {
    width: 50,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  patientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  moreButton: {
    backgroundColor: "#3498db",
    padding: 5,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-end",
  },
});

export default PatientInfo;
