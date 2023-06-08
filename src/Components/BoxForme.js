import { View, Text, Center, Image, HStack } from "native-base";
import React from "react";

const BoxForme = ({ type }) => {
  return (
    <>
      {!type ? (
        <Image
          source={require("../image/sam.jpg")}
          w="100%"
          shadow={3}
          h="250"
          resizeMode="contain"
          alt="Eto'"
          roundedBottomRight={70}
          roundedBottomLeft={70}
          safeAreaTop
        />
      ) : (
        <Image
          source={require("../image/flapcmr.jpg")}
          w="100%"
          shadow={3}
          h="250"
          resizeMode="cover"
          alt="Eto'o"
          safeAreaTop
        />
      )}
    </>
  );
};

export default BoxForme;
