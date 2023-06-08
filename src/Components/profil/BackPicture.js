import { Box, Image, Text, View } from "native-base";
import React from "react";
import colors from "../../color";
import { useWindowDimensions } from "react-native";
const BackPicture = () => {
  const { height, width } = useWindowDimensions();

  return (
    <View w={"full"} h={height * 0.2} bg={colors.main} safeArea>
      <Box safeArea bg={colors.primary} />
      <Image
        source={require("../../image/flapcmr.jpg")}
        w="full"
        h="full"
        alt="cover"
      />
    </View>
  );
};

export default BackPicture;
