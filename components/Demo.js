import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const { width } = Dimensions.get("window");
const ratio = 228 / 362;
export const CARD_WIDTH = width * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * ratio;
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  button: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export const Cards = {
  Card1: 0,
  Card2: 1,
  Card3: 2,
  Card4: 3,
  Card5: 4,
  Card6: 5,
};

const Card = ({ type, navigation }) => {
  let source;
  switch (type) {
    case Cards.Card1:
      source = require("./front3.jpg");
      break;
    case Cards.Card2:
      source = require("./front3.jpg");
      break;
    case Cards.Card3:
      source = require("./front3.jpg");
      break;
    case Cards.Card4:
      source = require("./front3.jpg");
      break;
    case Cards.Card5:
      source = require("./front3.jpg");
      break;
    case Cards.Card6:
      source = require("./front3.jpg");
      break;
    default:
      throw Error("Invalid card style");
  }

  const handleCheckHealthPress = () => {
    navigation.navigate("CheckHealth");
  };

  return (
    <>
      <Image style={styles.card} source={source} />
      {type === Cards.Card1 && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleCheckHealthPress}
        >
          <Text style={styles.buttonText}>Check Health</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Card;
