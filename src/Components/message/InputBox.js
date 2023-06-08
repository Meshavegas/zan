import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { Pressable } from "react-native";
import { getItemFor, removeKey } from "../../reducer/StrorageHelper";
import { useNavigation } from "@react-navigation/native";
import {
  or,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../Firebase/Config";
import { updateMessage } from "../../action/message";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { updateMessages } from "../../action/messages";

const Loged = "LOG_ID";
const InputBox = ({ id, otherUserId, uid }) => {
  const param = id;
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const dispatch = useDispatch();

  const getCon = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const q = query(
      collection(db, "conversation"),
      orderBy("date", "desc"),
      or(where("user1", "==", user.uid), where("user2", "==", user.uid))
    );

    const snapShot = await getDocs(q);
    let list = [];
    snapShot.forEach((doc) => {
      let obj = doc.data();
      list.push(obj);
    });

    console.log(list);
    dispatch(updateMessage(list));
    setMessages(list);
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const getUserID = async () => {
      setUserId(await getItemFor(Loged));
    };
    getUserID();

    console.log("mon query", user.uid);

    getCon();
    const getMessages = async () => {
      console.log("get message", param);
      const q = query(
        collection(db, `conversation/${param}/messages`),
        orderBy("date", "desc")
      );
      const messages = await getDocs(q);
      let messa = [];
      messages.forEach((doc) => {
        doc.data();
        messa.push(doc.data());
      });
      dispatch(updateMessages(messa));
      setMessage(messa);
    };
    id ? getMessages() : null;
  }, [loading, id]);

  const onSend = () => {
    if (newMessage.length > 0) {
      setLoading(true);
      let message = {
        id: "" + Math.floor(new Date().getTime() / 100),
        uri: "",
        date: new Date(),
        sender: userId,
        body: newMessage,
        receiver: otherUserId,
      };

      const transRef = collection(db, `conversation/${id}/messages`);
      setDoc(doc(transRef, message.id), message)
        .then((res) => {
          console.log("reponse", res);
          setLoading(false);

          const data = {
            date: new Date(),
            lastmessage: newMessage,
            type: "text",
            sendBy: userId,
            user1: userId,
            user2: uid,
          };
          const updateRef = doc(db, "conversation", id);
          setDoc(updateRef, data, { merge: true })
            .catch((er) => {
              setLoading(false);
              console.log(er);
            })
            .then((e) => {
              setLoading(false);
              setNewMessage("");
              console.log(data);
              getCon();
            });
        })
        .catch((er) => {
          setLoading(false);
          console.log(er);
        });
    }
  };
  const logOut = async () => {
    const user = await removeKey(Loged);
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <Pressable onPress={logOut}>
        <AntDesign name="plus" size={20} color="orange" />
      </Pressable>

      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="Message"
      />
      <MaterialIcons
        onPress={onSend}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    marginHorizontal: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,

    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    backgroundColor: "orange",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
});
export default InputBox;
