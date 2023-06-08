import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { getAuth } from "firebase/auth";
const SingleMessage = ({ message }) => {
  useEffect(() => {}, []);
  const isMyMessage = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return message.receiver !== user.uid;
  };
  return (
    <TouchableOpacity>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isMyMessage() ? "#f57c00" : "white",
            alignSelf: isMyMessage() ? "flex-end" : "flex-start",
          },
        ]}
      >
        <Text>{message.body}</Text>
        <Text style={styles.time}>
          {dayjs(new Date(message.date.seconds * 1000)).fromNow(true)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
});
export default SingleMessage;
