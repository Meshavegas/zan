import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  TextArea,
  View,
  VStack,
  ZStack,
} from "native-base";
import React, { useState } from "react";
import { useWindowDimensions, View as Vue } from "react-native";
import colors from "../../color";
import { Ionicons } from "@expo/vector-icons";
import { ImagePicker } from "expo-image-multiple-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Video } from "expo-av";
import { useEffect } from "react";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "@firebase/storage";
import { db, storage } from "../../Firebase/Config";
import { getItemFor } from "../../reducer/StrorageHelper";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { log } from "react-native-reanimated";
import Iframe from "react-iframe";

let link = [];
let linkLocal = [];
const Loged = "LOG_ID";
const AddPost = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [textArea, setTextArea] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});

  const handlePicture = () => {
    setOpen(true);
  };
  const handleImages = (d) => {
    setMediaData(d);
    linkLocal = d;
    console.log(d);
  };

  const uploadFile = async (file) => {
    console.log("Envoie en cour...");
    const response = await fetch(file.uri);
    const blobFile = await response.blob();

    if (file?.mediaType == "photo") {
      const reference = ref(
        storage,
        "pubs/photo/" + Math.round(Math.random() * 268) + file.filename
      );

      const result = await uploadBytes(reference, blobFile);
      const url = await getDownloadURL(result.ref);
      console.log(url);

      link.push({ uri: url, type: "photo" });
    } else {
      const reference = ref(
        storage,
        "pubs/video/" + Math.round(Math.random() * 268) + file.filename
      );
      const result = await uploadBytes(reference, blobFile);

      const url = await getDownloadURL(result.ref);
      link.push({ uri: url, type: "video" });
    }
  };

  const handleOnPost = async () => {
    if (textArea.length > 4 && linkLocal.length > 0) {
      setLoading(true);
      console.log("Taille ", linkLocal.length);
      await Promise.all(linkLocal.map(async (e) => uploadFile(e)));

      console.log("lien", link);
      let publication = {
        id: "" + Math.floor(new Date().getTime() / 100),
        like: [],
        comments: [],
        uri: link,
        date: new Date(),
        autheur: userId,
        body: textArea,
      };
      const transRef = collection(db, "pub");
      setDoc(doc(transRef, publication.id), publication)
        .then((res) => {
          console.log(res);
          setLoading(false);
          navigation.navigate("Actualite");
        })
        .catch((er) => {
          setLoading(false);
          console.log(er);
        });
    } else if (textArea.length > 4 && linkLocal.length == 0) {
      setLoading(true);
      let publication = {
        id: "" + Math.floor(new Date().getTime() / 100),
        like: [],
        comments: [],
        uri: link,
        date: new Date(),
        autheur: userId,
        body: textArea,
      };
      const transRef = collection(db, "pub");
      setDoc(doc(transRef, publication.id), publication)
        .then((res) => {
          console.log(res);
          setLoading(false);
          navigation.navigate("Actualite");
        })
        .catch((er) => {
          setLoading(false);
          console.log(er);
        });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          rounded={4}
          bg={textArea === "" ? colors.gray : colors.primary}
        >
          <Button
            px={6}
            py={2}
            isDisabled={textArea === "" ? true : false}
            onPress={() => handleOnPost()}
            isLoadingText="Publication..."
            isLoading={loading}
            bg={textArea === "" ? colors.gray : colors.primary}
          >
            Poster
          </Button>
        </Pressable>
      ),
    });
  }, [textArea, loading]);

  useEffect(() => {
    const getUserID = async () => {
      setUserId(await getItemFor(Loged));
    };
    getUserID();
    console.log("Utilisateur", userId);
    getUserID();

    const getUsers = async () => {
      const usr = doc(db, "users", userId);
      const tx = await getDoc(usr);
      setUser(tx.data());
    };
    if (userId) {
      getUsers();
    }
  }, [userId]);

  return (
    <>
      {open ? (
        <ImagePicker
          onSave={(assets) => {
            handleImages(assets);
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          video
          limit={4}
          galleryColumns={4}
          multiple
        />
      ) : (
        <View bg={colors.white} flex={1}>
          <VStack>
            <HStack pl={2} borderColor={colors.lightwhite} py={2}>
              <Image
                source={{ uri: user?.uri }}
                w="20"
                h={"20"}
                rounded="50"
                alt="Picture"
              />
              <VStack justifyContent={"center"}>
                <Heading ml={2}>{user?.prenom + " " + user?.nom}</Heading>
              </VStack>
            </HStack>
            <Center shadow="2">
              <TextArea
                value={textArea}
                placeholder="Quoi de neuf?"
                fontSize={25}
                w="98%"
                h={height * 0.5}
                borderColor={colors.white}
                _focus={{
                  bg: colors.white,
                  borderColor: colors.white,
                }}
                onChangeText={(e) => setTextArea(e)}
              />
            </Center>

            <View
              m={"0"}
              mt="-4"
              zIndex={40}
              shadow="2"
              borderColor={colors.lightwhite}
              h={height * 0.5}
              pt={8}
              px="10"
              roundedTopRight={"40"}
              roundedTopLeft={"40"}
            >
              <VStack>
                <HStack>
                  <Pressable onPress={handlePicture}>
                    <Text fontSize={24}>
                      {" "}
                      <Ionicons
                        name="md-images-outline"
                        size={24}
                        color={colors.primary}
                      />{" "}
                      Photo/Vidéo
                    </Text>
                  </Pressable>
                </HStack>
                <ZStack>
                  {mediaData.map((media, index) => {
                    return media?.mediaType == "photo" ? (
                      <Vue
                        key={index}
                        style={{
                          marginLeft: 50 * index,
                          marginTop: 15 * index,
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: media.uri }}
                          w={width * 0.35}
                          h={width * 0.35}
                          resizeMode="cover"
                          alt="Images"
                        />
                      </Vue>
                    ) : (
                      <Vue
                        key={index}
                        style={{
                          marginLeft: 50 * index,
                          marginTop: 15 * index,
                        }}
                      >
                        <Video
                          source={{ uri: media.uri }}
                          style={{
                            height: width * 0.35,
                            width: width * 0.35,
                            marginHorizontal: 10,
                            borderRadius: 5,
                          }}
                        />
                      </Vue>
                    );
                  })}
                </ZStack>
              </VStack>
            </View>
          </VStack>
        </View>
      )}
    </>
  );
};

export default AddPost;
