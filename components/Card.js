import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const ratio = 228 / 362;
export const CARD_WIDTH = width * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * ratio;
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

export const Cards = {
  Card1: 0,
  Card2: 1,
  Card3: 2,
  Card4: 3,
  Card5: 4,
  Card6: 5,
  Card7: 6,
};

export default function Card({ type }) {
  let source;
  switch (type) {
    case Cards.Card1:
      source = require("../image/image1.jpg");
      break;
    case Cards.Card2:
      source = require("../image/image4.png");
      break;
    case Cards.Card3:
      source = require("../image/image5.jpg");
      break;
    case Cards.Card4:
      source = require("../image/image6.jpg");
      break;
    case Cards.Card5:
      source = require("../image/image8.png");
      break;
    case Cards.Card6:
      source = require("../image/image7.jpg");
      break;
    case Cards.Card7:
      source = require("../image/image10.jpg");
      break;
    default:
      throw Error("Invalid card style");
  }
  return <Image style={styles.card} source={source} />;
}
