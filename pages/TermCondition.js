import React from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native";

const TermCondition = () => {
  return (
    <Container>
      <StyledScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Heading>Terms & Conditions</Heading>

        <Section>
          <SubHeading>1. Acceptance</SubHeading>
          <Paragraph>
            By using this app, you agree to these terms.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>2. Responsible Use</SubHeading>
          <Paragraph>
            Use the app lawfully and respectfully.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>3. Ownership</SubHeading>
          <Paragraph>
            Content in this app is protected property.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>4. Privacy</SubHeading>
          <Paragraph>
            We respect your privacy. See our Privacy Policy.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>5. Termination</SubHeading>
          <Paragraph>
            We may suspend access if terms are violated.
          </Paragraph>
        </Section>

        <Section>
          <SubHeading>6. Updates to Terms</SubHeading>
          <Paragraph>
            Terms may change. Continued use means acceptance.
          </Paragraph>
        </Section>
      </StyledScrollView>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f7;
  padding: 15px;
`;

const StyledScrollView = styled(ScrollView)`
  padding-bottom: 30px;
`;

const Heading = styled.Text`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #1a1a2e;
`;

const Section = styled.View`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 5px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
`;

const SubHeading = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #394867;
`;

const Paragraph = styled.Text`
  font-size: 15px;
  line-height: 25px;
  color: #606f7b;
`;

export default TermCondition;
