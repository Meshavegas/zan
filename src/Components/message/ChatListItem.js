import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { StyleSheet } from "react-native";
import "dayjs/locale/fr";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Config";
dayjs.extend(relativeTime);
dayjs.locale("fr");

const ChatListItem = ({ chat }) => {
  const [user, setUser] = useState({});

  const navigation = useNavigation();
  useEffect(() => {
    const getUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user.uid, chat);

      let iduser = "";

      if (chat.user1 === user.uid) {
        iduser = chat.user2;
      } else {
        iduser = chat.user1;
      }

      const usr = doc(db, "users", iduser);
      const tx = await getDoc(usr);
      setUser(tx.data());
    };
    getUserData();
  }, []);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Discussion", {
          id: chat.id,
          name: user.prenom + " " + user.nom,
          userId: user.id,
        })
      }
      style={styles.container}
    >
      <Image source={{ uri: user.uri }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {user.prenom + " " + user.nom}
          </Text>
          <Text style={styles.subTitle}>
            {dayjs(new Date(chat.date?.seconds * 1000)).fromNow(true)}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {chat.lastmessage}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },

  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default ChatListItem;
