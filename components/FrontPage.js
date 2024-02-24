import React, { useState, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, StyleSheet, Dimensions } from 'react-native';

const FrontPage = ({ navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const images = [
    require('./front1.jpg'),
    require('./front2.jpg'),
    require('./front3.jpg'),
  ];

  const handleScroll = (event) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / (Dimensions.get('window').width * 1.2));
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Image Slider */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </ScrollView>

      {/* Text below Image */}
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Welcome to HealthPredict</Text>
        <Text style={styles.description}>
          Explore the amazing features and functionalities that make our app unique.
          Swipe left or right to discover more!
        </Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Dots */}
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentImageIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    top: Dimensions.get('window').height * 0.05,
    width: Dimensions.get('window').width * 0.8, // 80% of the screen width
    height: Dimensions.get('window').height * 0.4,
    bottom: Dimensions.get('window').height * 0.05,
    resizeMode: 'cover',
    marginHorizontal: Dimensions.get('window').width * 0.1, // 10% of the screen width on both sides
  },
  textContainer: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.25,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#3498db',
    bottom: Dimensions.get('window').height * 0.13,
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'black',
  },
});

export default FrontPage;
