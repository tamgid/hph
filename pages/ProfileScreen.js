import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { Dimensions, Text } from "react-native";
import { firebase } from "../config"; // Your Firebase configuration file

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const currentUser = firebase.auth().currentUser; // Get current authenticated user
        if (currentUser) {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid) // Fetch the document of the current user
            .get();

          if (userDoc.exists) {
            setUserDetails(userDoc.data()); // Set the user details state with Firestore data
          } else {
            console.log("No such user!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // Show loading while fetching data
  }

  if (!userDetails) {
    return <Text>No User Data Available</Text>; // Show message if no user data is found
  }

  return (
    <BackgroundImage source={require("../image/profile_background.png")}>
      <ProfileContainer>
        <ProfilePicture
          source={
            userDetails?.profileImage
              ? { uri: userDetails.profileImage }
              : require("../image/tamgid.jpg")
          }
          onError={() => console.log("Failed to load profile image")}
        />
        <Name>{userDetails.name || "User Name"}</Name>
      </ProfileContainer>
      <DetailsContainer>
        <Detail>
          <Label>YOUR EMAIL</Label>
          <Value>{userDetails.email || "No Email"}</Value>
        </Detail>
        <Detail borderTop>
          <Label>DATE OF BIRTH</Label>
          <Value>{userDetails.dateOfBirth || "No Date of Birth"}</Value>
        </Detail>
        <Detail borderTop>
          <Label>DIVISION</Label>
          <Value>{userDetails.division || "No Division"}</Value>
        </Detail>
        <Detail borderTop>
          <Label>USERNAME</Label>
          <Value>{userDetails.username || "No Username"}</Value>
        </Detail>
        <Detail borderTop>
          <Label>PASSWORD</Label>
          <Value>{userDetails.password ? "********" : "No Password"}</Value>
        </Detail>
      </DetailsContainer>
    </BackgroundImage>
  );
};

// Styled components
const BackgroundImage = styled.ImageBackground`
  flex: 1;
  resize-mode: cover;
  justify-content: center;
`;

const ProfileContainer = styled.View`
  position: absolute;
  top: ${height * 0.06}px;
  left: ${width * 0.06}px;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
`;

const ProfilePicture = styled.Image`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  border-width: 3px;
  border-color: #fff;
`;

const Name = styled.Text`
  font-size: 18px;
  margin-left: 15px;
  flex-shrink: 1;
  flex-wrap: wrap;
  max-width: ${width * 0.6}px;
  margin-bottom: 20px;
`;

const DetailsContainer = styled.View`
  margin-top: ${height * 0.15}px;
  margin-horizontal: 30px;
`;

const Detail = styled.View`
  padding-vertical: 20px;
  padding-horizontal: 15px;
  ${({ borderTop }) =>
    borderTop &&
    `
    border-top-width: 1px;
    border-top-color: #ddd;
    padding-top: 13px;
  `}
`;

const Label = styled.Text`
  font-size: 12px;
  font-weight: 300;
  color: #666;
  margin-bottom: 10px;
`;

const Value = styled.Text`
  font-size: 15px;
  color: #333;
`;

export default ProfileScreen;
