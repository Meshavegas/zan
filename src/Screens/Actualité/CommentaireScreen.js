import {
  Box,
  Center,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  VStack,
  Spinner,
} from "native-base";
import React from "react";
import moment from "moment";

import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import colors from "../../color";
import { Video } from "expo-av";
import { useState } from "react";
import { useWindowDimensions, ScrollView as SV } from "react-native";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../Firebase/Config";
import SingleCommentaire from "../../Components/SingleCommentaire";
import { useCallback } from "react";
import { getItemFor } from "../../reducer/StrorageHelper";

const Loged = "LOG_ID";
const CommentaireScreen = () => {
  const [Shot, setShot] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [da, setDa] = useState({});

  const [data, setData] = useState(null);
  const [com, setCom] = useState("");
  const [user, setUser] = useState({});
  const [focusIndex, setFocusIndex] = useState(0);
  const [userId, setUserId] = useState("");

  const route = useRoute();
  const { id } = route.params;

  const { height, width } = useWindowDimensions();
  const video = React.useRef(null);
  const displayImage = (da) => {
    setShowModal(true);
    setDa(da);
  };
  useEffect(() => {
    const getPub = async () => {
      const publication = doc(db, "pub", id);
      const tx = await getDoc(publication).then(async (pub) => {
        setData(pub.data());
        const usr = doc(db, "users", pub.data().autheur);
        await getDoc(usr).then((docs) => {
          // console.log(docs.data());
          setUser(docs.data());
        });
      });
    };
    getPub();
    const getUserID = async () => {
      setUserId(await getItemFor(Loged));
    };
    getUserID();
  }, []);

  const scrolled = useCallback(
    (e) => {
      const offset = Math.round((e.nativeEvent.contentOffset.x / width) * 0.9);
      setFocusIndex(offset);
    },
    [setFocusIndex]
  );

  const sendCom = () => {
    if (com.length > 2) {
      setCommenting(true);
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
          setCommenting(false);
        })
        .then((e) => {
          setCom("");
          console.log(comment);
          setCommenting(false);
        });
    }
  };

  return (
    <View>
      <ScrollView>
        <VStack>
          <ScrollView style={{ height: height * 0.8 }}>
            <VStack shadow={4} m={1} bg={colors.lightwhite}>
              <HStack alignItems="center">
                <Image
                  source={{ uri: user?.uri }}
                  w={60}
                  h={60}
                  rounded={50}
                  alt="Post"
                />
                <VStack
                  w={{
                    base: "72%",
                    md: "25%",
                  }}
                  pl={4}
                >
                  <Heading fontSize={20}>
                    {user?.prenom + " " + user?.nom}
                  </Heading>
                  <Heading fontSize={15}>
                    {moment(new Date(data?.date?.seconds * 1000)).format(
                      "DD MMMM YYYY [à] HH:mm"
                    )}
                  </Heading>
                </VStack>
                <Pressable>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </Pressable>
              </HStack>
              {data?.uri?.length > 0 ? (
                <>
                  <Pressable
                    onPress={() => setShot(!Shot)}
                    mx={4}
                    borderTopColor={colors.white}
                    borderTopWidth={1}
                  >
                    <Text
                      isTruncated={Shot}
                      w="80%"
                      fontSize="lg"
                      textAlign="left"
                    >
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
                <Center my={3}>
                  <Box
                    bg={{
                      linearGradient: {
                        colors: [
                          colors.ramdon[Math.floor(Math.random() * 5)],
                          colors.ramdon[Math.floor(Math.random() * 5)],
                        ],
                        start: [0, 1],
                        end: [1, 0],
                      },
                    }}
                    mx="1"
                    rounded="xl"
                    style={{ width: width * 0.9, height: height * 0.4 }}
                    justifyContent="center"
                    alignItems="center"
                    _text={{
                      fontSize: "xl",
                      fontWeight: "medium",
                      color: "warmGray.50",
                      textAlign: "center",
                    }}
                  >
                    {data?.body}
                  </Box>
                </Center>
              )}
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                size="full"
                bg={colors.darkgray}
                height={height}
              >
                <Modal.Content maxWidth={width}>
                  <Modal.Body>
                    <Image
                      source={da?.uri}
                      w={width}
                      h={height * 0.7}
                      alt="Commande"
                    />
                  </Modal.Body>
                </Modal.Content>
              </Modal>
            </VStack>
            <HStack bg={colors.lightwhite}>
              <Box m={2} bg={colors.primary} p={2} rounded={15}>
                <Text fontSize={19} color={colors.white}>
                  {data?.like?.length + " "} Likes
                </Text>
              </Box>
              <Box
                m={2}
                bg={colors.primary}
                p={2}
                rounded={15}
                style={{ position: "absolute", right: 2 }}
              >
                <Text fontSize={19} color={colors.white}>
                  {" " + data?.comments?.length + " "} Commentaires
                </Text>
              </Box>
            </HStack>
            <VStack>
              {data?.comments.length > 0 ? (
                data?.comments.map((com, index) => (
                  <SingleCommentaire key={index} com={com} />
                ))
              ) : (
                <View h={height * 0.1}></View>
              )}
            </VStack>
          </ScrollView>
          <Input
            style={{ width: width * 0.6 }}
            rounded={25}
            mx={"5"}
            mb={2}
            placeholder="Laiser un commentaire"
            placeholderTextColor={colors.darkgray}
            onChangeText={(e) => setCom(e)}
            value={com}
            _focus={{
              mb: 10,
            }}
            InputRightElement={
              commenting ? (
                <View bg={colors.primary} h="full">
                  <Center p={2}>
                    <Spinner color="white" size={"10"} />
                  </Center>
                </View>
              ) : (
                <View bg={colors.primary} h="full">
                  <Pressable onPress={sendCom}>
                    <MaterialIcons name="send" size={40} color={colors.white} />
                  </Pressable>
                </View>
              )
            }
            InputLeftElement={
              <MaterialIcons
                name="photo-library"
                size={30}
                color={colors.primary}
                style={{ marginLeft: 10 }}
              />
            }
          />
        </VStack>
      </ScrollView>
    </View>
  );
};

export default CommentaireScreen;
