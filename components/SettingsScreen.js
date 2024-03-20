import React from 'react';
import styled from 'styled-components/native';

const SettingsScreen = () => {
  return (
    <Container>
      <Header>
        <Title>Settings</Title>
      </Header>
      <Option onPress={() => console.log('Account Settings')}>
        <OptionText>Account Settings</OptionText>
      </Option>
      <Option onPress={() => console.log('Notifications')}>
        <OptionText>Notifications</OptionText>
      </Option>
      <Option onPress={() => console.log('Privacy')}>
        <OptionText>Privacy</OptionText>
      </Option>
      <Option onPress={() => console.log('Security')}>
        <OptionText>Security</OptionText>
      </Option>
      <Option onPress={() => console.log('Help & Support')}>
        <OptionText>Help & Support</OptionText>
      </Option>
      <Option onPress={() => console.log('Log Out')}>
        <OptionText>Log Out</OptionText>
      </Option>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Header = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  border-color: #ddd;
  margin-top: 20px;
`;

const Title = styled.Text`
  font-size: 23px;
  font-weight: bold;
`;

const Option = styled.TouchableOpacity`
  padding-vertical: 18px;
  padding-horizontal: 20px;
  border-bottom-width: 1px;
  border-color: #ddd;
`;

const OptionText = styled.Text`
  font-size: 18px;
`;

export default SettingsScreen;
