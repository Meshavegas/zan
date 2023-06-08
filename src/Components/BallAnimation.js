import { Image, View } from "native-base";
import React from "react";
import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const BallAnimation = () => {
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(5400, {
        duration: 9000,
        easing: Easing.linear,
      })
    );
    return () => cancelAnimation(rotation);
  }, []);

  return (
    <Animated.View
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        animatedStyles,
      ]}
    >
      <Image
        source={require("../image/spniner.png")}
        w={"70"}
        h={"70"}
        alt="spniner"
      />
    </Animated.View>
  );
};

export default BallAnimation;
