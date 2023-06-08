import {
  Box,
  FlatList,
  FormControl,
  Modal,
  Pressable,
  Text,
  View,
  Input,
  VStack,
} from "native-base";
import React, { useState } from "react";
import chats from "../../Data/chats.json";
import { FontAwesome } from "@expo/vector-icons";
import ChatListItem from "../../Components/message/ChatListItem";
import colors from "../../color";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  or,
  limit,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../Firebase/Config";
import { getItemFor, removeKey } from "../../reducer/StrorageHelper";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateMessage } from "../../action/message";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const Loged = "LOG_ID";
const MessageScreen = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [users, setUser] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const user = useSelector((state) => state.message);
  console.log("user", user);
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const getUserID = async () => {
      if (user) {
        setUserId(await getItemFor(Loged));
      } else {
        await removeKey(Loged);
        navigation.navigate("Login");
      }
    };
    getUserID();

    const getCon = async () => {
      const q = query(
        collection(db, "conversation"),
        orderBy("date", "desc"),
        or(where("user1", "==", userId), where("user2", "==", userId))
      );
      onSnapshot(q, (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          cities.push(doc.data());
        });

        dispatch(updateMessage(cities));
      });
      // console.error("on change ", unsubscribe);
    };

    {
      userId === "" ? null : getCon();
    }
  }, [userId]);

  const Item = ({ data }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("Discussion", {
          id: "" + Math.floor(new Date().getTime() / 100),
          name: data.prenom + " " + data.nom,
          userId: data.id,
        })
      }
    >
      <View bg={colors.lightgray} mt={3} p={2}>
        <Text fontSize={20}>{data?.nom + " " + data?.prenom}</Text>
      </View>
    </Pressable>
  );
  const getUsers = async () => {
    const p = query(collection(db, "users"), where("nom", "==", users));
    onSnapshot(p, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
      });
      console.log("nom", cities);
      setUsersList(cities);
    });
  };
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  return (
    <>
      <Box bg={colors.primary} safeArea />
      <FlatList
        data={user.message}
        renderItem={({ item }) => <ChatListItem chat={item} />}
        style={{ backgroundColor: "white" }}
      />
      <Box
        w={20}
        h={20}
        bg={colors.primary}
        position={"absolute"}
        bottom={4}
        right={4}
        rounded={50}
      >
        <Pressable onPress={() => setShow(true)}>
          <Feather name="plus" size={80} color="white" />
        </Pressable>
      </Box>

      <Modal
        isOpen={show}
        onClose={() => setShow(false)}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content w={"96%"} h={"80%"}>
          <Modal.CloseButton />
          <Modal.Header>Rechecher une personne</Modal.Header>
          <Modal.Body>
            <VStack>
              <Input
                bg={colors.lightwhite}
                borderColor={colors.main}
                w={{
                  base: "100%",
                  md: "25%",
                }}
                h={10}
                onChangeText={(e) => {
                  setUser(e);
                }}
                ref={initialRef}
                InputRightElement={
                  <Pressable onPress={() => getUsers()}>
                    <Box p={1} bg={colors.primary} h={"full"} w={10}>
                      <FontAwesome name="search" size={24} color="white" />
                    </Box>
                  </Pressable>
                }
              />
            </VStack>
            <Box>
              {usersList.map((ac, key) => (
                <Item data={ac} key={key} />
              ))}
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default MessageScreen;
