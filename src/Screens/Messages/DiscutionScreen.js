import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Center,
  FlatList,
  Heading,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { useEffect } from "react";
import InputBox from "../../Components/message/InputBox";
import SingleMessage from "../../Components/message/SingleMessage";
import colors from "../../color";
import { Entypo } from "@expo/vector-icons";
import { Pressable, useWindowDimensions } from "react-native";
import { db } from "../../Firebase/Config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { updateMessages } from "../../action/messages";
import { useDispatch, useSelector } from "react-redux";
const DiscutionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { height, width } = useWindowDimensions();
  const [message, setMessage] = useState({});
  const [collectionId, setCollectionId] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const msg = useSelector((state) => state.messages);

  const CustomHeader = ({ uri, name }) => {
    return (
      <View w={width * 0.65}>
        <HStack>
          <Image
            source={{ uri: uri }}
            alt="profil"
            h={10}
            w={10}
            rounded={40}
            resizeMode="cover"
            mr={4}
          />
          <VStack>
            <Center>
              <Heading color={colors.white}>{name}</Heading>
              <Text mt={-2} fontSize={12} color={colors.lightgray}>
                Vue à 15 h
              </Text>
            </Center>
          </VStack>
        </HStack>
      </View>
    );
  };

  const OptionHit = () => {
    return (
      <Pressable>
        <Entypo name="dots-three-vertical" size={24} color={colors.lightgray} />
      </Pressable>
    );
  };
  useEffect(() => {
    const param = route.params;

    console.log("param", param);
    setCollectionId(route.params.id);
    setOtherUserId(param.userId);
    const getUser = async () => {
      const usr = doc(db, "users", param.userId);
      const tx = await getDoc(usr);
      navigation.setOptions({
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: colors.primary },
        headerTitle: (props) => (
          <CustomHeader
            proprity={props}
            name={route.params.name}
            uri={tx.data().uri}
          />
        ),
        headerRight: (props) => (
          <OptionHit onPress={navigation.goBack} pro={props} />
        ),
      });
      setUser(tx.data());
    };
    getUser();
    const getMessages = async () => {
      console.log("param M", param);
      const q = query(
        collection(db, `conversation/${param.id}/messages`),
        orderBy("date", "desc")
      );
      // const messages = await getDocs(q);
      onSnapshot(q, (querySnapshot) => {
        let messa = [];
        querySnapshot.forEach((doc) => {
          messa.push(doc.data());
        });
        dispatch(updateMessages(messa));
      });

      // setMessage(messa);
    };

    param.id ? getMessages() : null;
    // navigation.setOptions({ title: route.params.name });
  }, [route.params.id]);

  return (
    <View flex={1} pb={2}>
      <FlatList
        data={msg.messages}
        renderItem={({ item }) => <SingleMessage message={item} />}
        p={2}
        inverted
      />

      <InputBox
        id={collectionId}
        otherUserId={otherUserId}
        uid={route.params.userId}
      />
    </View>
  );
};

export default DiscutionScreen;
