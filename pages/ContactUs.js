import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or any other icon library you're using

const { width, height } = Dimensions.get('window');

const ContactUs = () => {
  return (
    <Container>
      <BackgroundImage
        source={require('../image/ContactUsBackground.png')}
        resizeMode="cover"
      >
        <ContentContainer>
          {/* Website */}
          <Item>
            <Icon name="globe" size={25} />
            <ItemText>www.healthpredicthub.com</ItemText>
          </Item>

          {/* Phone */}
          <Item>
            <Icon name="phone" size={25} />
            <ItemText>+8801571-001925</ItemText>
          </Item>

          {/* Email */}
          <Item>
            <Icon name="envelope" size={24} />
            <ItemText>tamgid311@gmail.com</ItemText>
          </Item>

          {/* Location */}
          <Item>
            <Icon name="map-marker" size={26} />
            <ItemText>CU, Chittagong, Bangladesh</ItemText>
          </Item>
        </ContentContainer>
      </BackgroundImage>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
`;

const BackgroundImage = styled.ImageBackground`
  width: ${width}px;
  height: ${height}px;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: ${height * 0.2}px; 
`;

const Item = styled.View`
  align-items: center;
  margin-bottom: 25px;
`;

const ItemText = styled.Text`
  font-size: 15px;
  margin-top: 5px;
  text-align: center;
`;

export default ContactUs;
