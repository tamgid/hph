import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const AboutUs = () => {
  return (
    <Container>
      <BackgroundImage source={require('../image/back.png')} resizeMode="cover">
        {/* Text Container on the top-right */}
        <TextContainer>
          <AboutText>
            We are a dedicated team committed to advancing predictive healthcare solutions. 
            Our Logistic Regression model achieves more than 80% accuracy in predicting the 
            likelihood of heart disease.
          </AboutText>
        </TextContainer>

        {/* Confusion Matrix Image on the bottom-left */}
        <ConfusionMatrixImage source={require('../image/confusion_matrix.png')} />
      </BackgroundImage>
    </Container>
  );
};

// Styled components
const Container = styled.View`
  flex: 1;
`;

const BackgroundImage = styled.ImageBackground`
  width: ${width}px;
  height: ${height}px;
  justify-content: center; /* Ensure content inside is centered vertically */
`;

const TextContainer = styled.View`
  position: absolute;
  top: ${height * 0.06}px;
  right: ${width * 0.02}px;
  width: ${width * 0.62}px;
  background-color: #fff8ed; /* Light background to improve readability */
`;

const AboutText = styled.Text`
  font-size: 18px;
  color: #000;
  text-align: left;
`;

const ConfusionMatrixImage = styled.Image`
  position: absolute;
  bottom: ${height * 0.195}px; /* Distance from the bottom */
  left: ${width * 0.03}px;   /* Distance from the left */
  width: ${width * 0.79}px;   /* Adjust the image width */
  height: ${height * 0.33}px; /* Adjust the image height */
`;

export default AboutUs;
