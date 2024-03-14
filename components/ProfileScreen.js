import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <Image
        source={require('../image/cover.jpg')}
        style={styles.coverPhoto}
      />
      {/* Profile Picture */}
      <TouchableOpacity style={styles.profilePictureContainer}>
        <Image
          source={require('../image/tamgid.jpg')}
          style={styles.profilePicture}
        />
      </TouchableOpacity>
      {/* User Information */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>Shadekur Rahman Tamgid</Text>
        <Text style={styles.bio}>Software Developer | Photographer</Text>
        <Text style={styles.location}>Chittagong, Bangladesh</Text>
      </View>
      {/* Navigation Tabs */}
      <View style={styles.tabs}>
        {/* <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Friends</Text>
        </TouchableOpacity> */}
        {/* Add more tabs as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 60,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userInfo: {
    marginTop: 100,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: 'gray',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
