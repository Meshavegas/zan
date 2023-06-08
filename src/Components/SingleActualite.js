import {
  ScrollView as SV,
  FlatList,
  Image as img,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  Box,
  Center,
  Heading,
  HStack,
  Image,
  Input,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useRef } from "react";
import colors from "../color";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/Config";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { getItemFor, removeKey } from "../reducer/StrorageHelper";

const SingleActualite = ({ data }) => {
  const [Shot, setShot] = useState(true);
  const { height, width } = useWindowDimensions();
  const video = React.useRef(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [linking, setLinking] = useState(false);
  const [com, setCom] = useState("");
  const navigation = useNavigation();

  const Loged = "LOG_ID";
  useEffect(() => {
    const getUsers = async () => {
      const usr = doc(db, "users", data.autheur);
      const tx = await getDoc(usr);
      setUser(tx.data());
    };
    getUsers();
  }, []);
  const getUserID = async () => {
    setUserId(await getItemFor(Loged));
  };
  getUserID();

  const logOut = async () => {
    const user = await removeKey(Loged);
    navigation.navigate("Login");
  };
  const scrolled = useCallback(
    (e) => {
      const offset = Math.round((e.nativeEvent.contentOffset.x / width) * 0.9);
      setFocusIndex(offset);
    },
    [setFocusIndex]
  );
  const element = useRef();

  const onLike = () => {
    setLinking(true);
    const isLiked = data.like.findIndex((l) => l.usr == userId);

    if (isLiked === -1) {
      const like = { date: new Date(), usr: userId, type: "heart" };

      data.like.push(like);
      const updateRef = doc(db, "pub", data.id);
      setDoc(updateRef, data, { merge: true })
        .catch((er) => {
          setLinking(false);
          console.log(er);
        })
        .then(() => {
          setLinking(false);
        });
    } else {
      const updateRef = doc(db, "pub", data.id);

      data.like.splice(isLiked, 1);

      setDoc(updateRef, data, { merge: true })
        .catch((er) => {
          setLoading(false);
          console.log(er);
        })
        .then(() => {
          setLinking(false);
        });
    }
  };
  const sendCom = () => {
    console.log(com);
    if (com.length > 3) {
      const comment = {
        date: new Date(),
        usr: userId,
        text: com,
      };
      data.comments.push(comment);
      const updateRef = doc(db, "pub", data.id);
      setDoc(updateRef, data, { merge: true })
        .catch((er) => {
          // setLoading(false);
          console.log(er);
        })
        .then((e) => {
          setCom("");
        });
    }
  };
  const profil = () => {
    console.log(user.id);
    navigation.navigate("Profile", { userId: user.id });
  };
  return (
    <View mt={3} bg={colors.lightwhite} mx={2} shadow={5} rounded={4}>
      <VStack>
        <HStack alignItems="center">
          <Pressable onPress={() => profil()}>
            <Image
              mx={2}
              my={1}
              source={{ uri: user?.uri }}
              w={60}
              h={60}
              rounded={50}
              alt="Post"
            />
          </Pressable>
          <VStack
            w={{
              base: "65%",
              md: "25%",
            }}
          >
            <Heading fontSize={20}>{user?.prenom + " " + user?.nom}</Heading>
            <Heading fontSize={15}>
              {moment(new Date(data.date?.seconds * 1000)).format(
                "DD MMMM YYYY [à] HH:mm"
              )}
            </Heading>
          </VStack>
          <Pressable>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </Pressable>
        </HStack>
        {data.uri?.length > 0 ? (
          <>
            <Pressable
              onPress={() => setShot(!Shot)}
              mx={4}
              borderTopColor={colors.white}
              borderTopWidth={1}
            >
              <Text isTruncated={Shot} w="80%" fontSize="lg" textAlign="left">
                {data.body}
              </Text>
              {Shot ? (
                <Text fontWeight="bold" fontStyle="italic" fontSize="sm">
                  lire la suite
                </Text>
              ) : null}
            </Pressable>
            <View style={{ flexDirection: "row" }} pt={2}>
              <SV
                horizontal
                style={{ height: height * 0.62 }}
                onScroll={scrolled}
                showsHorizontalScrollIndicator={true}
                persistentScrollbar={true}
              >
                {data.uri.map((photo, index) =>
                  photo.type === "photo" ? (
                    <Image
                      key={index}
                      mx={2}
                      rounded={5}
                      source={{ uri: photo.uri }}
                      alt="Post"
                      style={{ height: height * 0.6, width: width * 0.9 }}
                    />
                  ) : (
                    <Video
                      key={index}
                      ref={video}
                      source={{ uri: photo.uri }}
                      rate={1.0}
                      volume={1}
                      useNativeControls
                      resizeMode="cover"
                      style={{
                        height: height * 0.6,
                        width: width * 0.9,
                        marginHorizontal: 10,
                        borderRadius: 5,
                      }}
                    />
                  )
                )}
              </SV>
            </View>
          </>
        ) : (
          <Center>
            <Box
              bg={{
                linearGradient: {
                  colors: [
                    colors.ramdon[Math.floor(Math.random() * 5)],
                    colors.ramdon2[Math.floor(Math.random() * 5)],
                  ],
                  start: [0, 1],
                  end: [1, 0],
                },
              }}
              mx="1"
              rounded="xl"
              style={{ height: height * 0.4, width: width * 0.9 }}
              justifyContent="center"
              alignItems="center"
              _text={{
                fontSize: "xl",
                fontWeight: "medium",
                color: "warmGray.50",
                textAlign: "center",
              }}
            >
              {data.body}
            </Box>
          </Center>
        )}
        <HStack mt={1} pt={1} pb={1}>
          <HStack pl={2}>
            {linking ? (
              <Spinner color="warning.500" />
            ) : (
              <Pressable onPress={onLike}>
                {data.like.findIndex((l) => l.usr == userId) === -1 ? (
                  <AntDesign name="like2" size={24} color="black" />
                ) : (
                  <AntDesign name="like1" size={24} color="black" />
                )}
              </Pressable>
            )}
            <Text fontSize={"lg"}>{data.like?.length + " "}like</Text>
          </HStack>
          <HStack style={{ position: "absolute", right: 12 }}>
            <Pressable
              onPress={() =>
                navigation.navigate("Commentaire", { id: data.id })
              }
            >
              <HStack>
                <AntDesign name="message1" size={24} color="black" />
                <Text>{" " + data.comments?.length + " "}Commentaire</Text>
              </HStack>
            </Pressable>
          </HStack>
        </HStack>
        <Input
          style={{ width: width * 0.6 }}
          rounded={25}
          mx={"5"}
          mb={2}
          placeholder="Laiser un commentaire"
          placeholderTextColor={colors.darkgray}
          InputRightElement={
            <View bg={colors.primary} h="full">
              <Pressable onPress={sendCom}>
                <MaterialIcons name="send" size={40} color={colors.white} />
              </Pressable>
            </View>
          }
          onChangeText={(e) => setCom(e)}
          value={com}
          InputLeftElement={
            <Pressable onPress={logOut}>
              <AntDesign
                name="message1"
                size={30}
                color={colors.primary}
                style={{ marginLeft: 10 }}
              />
            </Pressable>
          }
        />
      </VStack>
    </View>
  );
};

export default SingleActualite;
