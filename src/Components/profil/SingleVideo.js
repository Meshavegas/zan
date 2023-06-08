import { Video } from "expo-av";
import { Text, View } from "native-base";
import React from "react";
import { useWindowDimensions } from "react-native";

const SingleVideo = ({ data }) => {
  const video = React.useRef(null);
  const { height, width } = useWindowDimensions();

  return (
    <>
      {data.uri.map((photo, index) =>
        photo.type !== "photo" ? (
          <Video
            key={index}
            ref={video}
            source={{ uri: photo.uri }}
            rate={1.0}
            volume={1}
            useNativeControls
            resizeMode="cover"
            style={{
              height: width * 0.85,
              width: width * 0.43,
              marginHorizontal: 10,
            }}
          />
        ) : null
      )}
    </>
  );
};

export default SingleVideo;
