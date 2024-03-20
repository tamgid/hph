import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const CoverPhoto = styled.Image`
  width: 100%;
  height: 200px;
  resize-mode: cover;
`;

const ProfilePictureContainer = styled.View`
  position: absolute;
  top: 150px;
  left: 20px;
  border-width: 3px;
  border-color: #fff;
  border-radius: 60px;
`;

const ProfilePicture = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
`;

const UserInfo = styled.View`
  margin-top: 100px;
  align-items: center;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Bio = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
`;

const Location = styled.Text`
  font-size: 16px;
  color: gray;
`;

const Tabs = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
  border-top-width: 1px;
  border-color: #ddd;
  padding-vertical: 10px;
`;

const Tab = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`;

const TabText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const ProfileScreen = () => {
  return (
    <Container>
      <CoverPhoto source={require('../image/cover.jpg')} />
      <ProfilePictureContainer>
        <ProfilePicture source={require('../image/tamgid.jpg')} />
      </ProfilePictureContainer>
      <UserInfo>
        <Name>Shadekur Rahman Tamgid</Name>
        <Bio>Software Developer | Photographer</Bio>
        <Location>Chittagong, Bangladesh</Location>
      </UserInfo>
      <Tabs>
        {/* Add your tabs here */}
        {/* <Tab>
          <TabText>Posts</TabText>
        </Tab>
        <Tab>
          <TabText>Photos</TabText>
        </Tab>
        <Tab>
          <TabText>Friends</TabText>
        </Tab> */}
      </Tabs>
    </Container>
  );
};

export default ProfileScreen;
