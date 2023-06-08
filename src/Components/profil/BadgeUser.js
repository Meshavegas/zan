import {
  Center,
  HStack,
  Heading,
  Image,
  Pressable,
  Text,
  VStack,
  View,
} from "native-base";
import React, { useState } from "react";
import colors from "../../color";
import { useWindowDimensions } from "react-native";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/Config";
import { EvilIcons } from "@expo/vector-icons";

const BadgeUser = ({ userId }) => {
  const { height, width } = useWindowDimensions();
  const [isUser, setIsUser] = useState();
  const [user, setUser] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    setIsUser(user.uid === userId);
    const getUsers = async () => {
      const usr = doc(db, "users", userId);
      const tx = await getDoc(usr);
      setUser(tx.data());
    };

    getUsers();
  }, [userId]);

  return (
    <Center>
      <View
        w={width * 0.9}
        h={height * 0.25}
        bg={colors.primary}
        mt={-height * 0.08}
        px={4}
        rounded={10}
        shadow={6}
      >
        <HStack
          borderStyle={"solid"}
          w={"full"}
          h={"full"}
          alignItems={"center"}
        >
          <Image
            source={{ uri: user?.uri }}
            w={"40%"}
            h={"70%"}
            alt="Abou"
            rounded={9}
            resizeMode="cover"
          />
          <VStack ml={4}>
            <Heading color={colors.white} w={"80%"}>
              {user.prenom + " " + user.nom}
            </Heading>

            <Text color={colors.white}>Footbaleur</Text>
            <Text color={colors.white}> {user.telephone}</Text>
            <Text color={colors.white}>Douala, Cameroun</Text>
          </VStack>
        </HStack>
        {isUser ? (
          <Pressable
            position={"absolute"}
            right={3}
            top={2}
            onPress={() => console.log("Cool")}
          >
            <EvilIcons name="pencil" size={24} color={colors.white} />
          </Pressable>
        ) : null}
      </View>
    </Center>
  );
};

export default BadgeUser;
