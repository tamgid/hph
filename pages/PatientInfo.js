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
          const userDataItem = {
            name: doc.data().name || "", // Fetch name
            email: doc.data().email || "", // Fetch email
            division: doc.data().division || "", // Fetch division
            country: doc.data().country || "", // Fetch division
          };
  
          // Fetch health data based on email
          const healthData = await fetchHealthCondition(doc.data().email);
          const updatedPatient = {
            ...userDataItem,
            age: healthData?.age || "", // Fetch age from healthCondition collection
            sex: healthData?.sex || "", // Fetch sex from healthCondition collection
            healthCondition: healthData?.target || "", // Fetch target/health condition
            lastVisit: healthData?.timestamp || "", // Assign the converted Date object as lastVisit
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
  
      // Convert the timestamp to a Date object
      const healthData = snapshot.docs.map((doc) => ({
        age: doc.data().age || "",
        sex: doc.data().sex || "",
        target: doc.data().target || "",
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : "", // Convert Firestore Timestamp to JavaScript Date object
      }))[0]; // Assuming only one health condition per user
  
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

  const totalPages = Math.ceil(patients.length / perPage); // Total number of pages

const handlePageChange = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};

const renderPageNumbers = () => {
  let startPage = Math.max(1, currentPage - 1); // Default to currentPage - 1
  let endPage = Math.min(startPage + 2, totalPages); // Show a range of 3 pages

  // Adjust startPage if we're near the last page
  if (endPage - startPage < 2 && startPage > 1) {
    startPage = Math.max(endPage - 2, 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <TouchableOpacity
        key={i}
        style={[
          styles.paginationButton,
          currentPage === i && styles.activeButton, // Highlight active page
        ]}
        onPress={() => handlePageChange(i)}
        disabled={currentPage === i} // Disable the button for the current page
      >
        <Text>{i}</Text>
      </TouchableOpacity>
    );
  }

  // If there are fewer than 3 pages, add empty buttons to maintain 3 visible buttons
  while (pageNumbers.length < 3) {
    pageNumbers.push(
      <TouchableOpacity key={`empty-${pageNumbers.length}`} style={styles.paginationButton} disabled={true}>
        <Text> </Text>
      </TouchableOpacity>
    );
  }

  return pageNumbers;
};

  return (
    <View style={styles.container}>
    <Text style={styles.heading}>Check all visitors</Text>
      <View style={styles.searchContainer}>
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
      <View style={styles.filterContainer}>
        <Text>Show:</Text>
        <TextInput
          style={styles.dropdown}
          value={String(perPage)}
          onChangeText={(value) => setPerPage(Number(value))}
          keyboardType="numeric"
        />
        <Text>Entries </Text>
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
      {/* Always show "Prev" button, but disable it on the first page */}
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.disabledButton, // Disable on the first page
        ]}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1} // Disable if on the first page
      >
        <Text>Prev</Text>
      </TouchableOpacity>

      {/* Render page numbers */}
      {renderPageNumbers()}

      {/* Always show "Next" button, but disable it on the last page */}
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.disabledButton, // Disable on the last page
        ]}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages} // Disable if on the last page
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
            <Text>Sex: {selectedPatient?.sex === 1 ? "Male" : "Female"}</Text>
            <Text>Country: {selectedPatient?.country}</Text>
            <Text>Division: {selectedPatient?.division}</Text>
            <Text>Health Condition: {selectedPatient?.healthCondition}</Text>
            <Text>Last Visit: {selectedPatient?.lastVisit ? selectedPatient.lastVisit.toLocaleString() : ""}</Text>
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
    backgroundColor: "#eeeeee",
  },
  heading: {
    fontSize: 15,
    marginBottom: 15,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dropdown: {
    width: 80,
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 9,
    paddingBottom: 9,
    backgroundColor: "#44c0fe",
    borderRadius: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  paginationButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#008ec0',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
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
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 7,
    paddingBottom: 7,
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 9,
    paddingBottom: 9,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-end",
  },
});

export default PatientInfo;
