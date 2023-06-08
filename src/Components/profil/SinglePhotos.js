import { Image, Text, View } from "native-base";
import React, { useState } from "react";
import colors from "../../color";
import { Pressable, useWindowDimensions } from "react-native";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const SinglePhotos = ({ data }) => {
  const { height, width } = useWindowDimensions();

  return (
    <>
      {data.uri.map((photo, index) =>
        photo.type === "photo" ? (
          <Image
            key={index}
            mx={1}
            my={1}
            source={{ uri: photo.uri }}
            alt="Post"
            style={{ height: width * 0.48, width: width * 0.46 }}
          />
        ) : null
      )}
    </>
  );
};

export default SinglePhotos;
