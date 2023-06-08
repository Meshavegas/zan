import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { Center } from "native-base";
import { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  event,
} from "react-native-reanimated";

const CustomImageCarouselSquare = ({ data }) => {
  const [newData] = useState([
    { key: "spacer-right" },
    ...data,
    { key: "spacer-left" },
  ]);
  const { width, height } = useWindowDimensions();
  const SPACER = (width - size) / 2;
  const size = width * 0.7;
  const x = useSharedValue(0);
  const [status, setStatus] = useState({});

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      {data
        ? data.map((ig, source) => {
            const style = useAnimatedStyle(() => {
              const scale = interpolate(
                x.value,
                [(source - 2) * size, (source - 2) * size, source * size],
                [0.8, 1, 0.8]
              );
              return {
                transform: [{ scale }],
              };
            });

            return (
              <View style={{ width: size }} key={source}>
                <Image
                  source={ig.uri}
                  alt="post"
                  style={{ height: 450, width: "100" }}
                  h={520}
                />
              </View>
            );
          })
        : null}
    </ScrollView>
  );
};

export default CustomImageCarouselSquare;
const styles = StyleSheet.create({
  imgContainer: {
    borderRadius: 34,
    overFlow: "hidden",
  },
});
