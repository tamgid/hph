import React from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native";

const TermCondition = () => {
  return (
    <Container>
      <StyledScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Heading>Terms and Conditions</Heading>

        <Section>
          <SubHeading>1. Introduction</SubHeading>
          <Paragraph>
            Welcome to our application. By accessing or using our app, you agree
            to comply with and be bound by the following terms and conditions.
            Please review them carefully.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>2. User Responsibilities</SubHeading>
          <Paragraph>
            You agree to use the app only for lawful purposes and in a way that
            does not infringe the rights of, restrict, or inhibit anyone else's
            use and enjoyment of the app.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>3. Intellectual Property</SubHeading>
          <Paragraph>
            All content, trademarks, and data on this app, including but not
            limited to software, databases, text, graphics, icons, hyperlinks,
            private information, designs, and agreements, are the property of or
            licensed to us and as such are protected from infringement by local
            and international legislation and treaties.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>4. Privacy Policy</SubHeading>
          <Paragraph>
            Your privacy is important to us. Our Privacy Policy explains how we
            collect, use, and protect your personal information.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>5. Termination of Use</SubHeading>
          <Paragraph>
            We reserve the right to terminate or suspend your access to our app,
            without prior notice, if you violate these terms and conditions or
            for any other reason.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>7. Changes to Terms</SubHeading>
          <Paragraph>
            We reserve the right to modify these terms at any time. Your
            continued use of the app following any changes signifies your
            acceptance of the updated terms.
          </Paragraph>
        </Section>
      </StyledScrollView>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 15px;
`;

const StyledScrollView = styled(ScrollView)`
  padding-bottom: 30px;
`;

const Heading = styled.Text`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #2b2d42;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SubHeading = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const Paragraph = styled.Text`
  font-size: 15px;
  line-height: 24px;
  color: #555;
`;

export default TermCondition;
