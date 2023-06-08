import {
  Box,
  Center,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  View,
} from "native-base";
import React from "react";
import colors from "../color";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { useEffect } from "react";
import { getItemFor } from "../reducer/StrorageHelper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Config";

const Loged = "LOG_ID";
const ActualiterHeader = ({ nav }) => {
  const [user, setUser] = useState({});

  const [userId, setUserId] = useState("");

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
    <Box bg={colors.primary} flex={1} width="full">
      <HStack ml={5} my={2} alignItems="center">
        <Image
          w={50}
          h={50}
          source={{ uri: user?.uri }}
          alt="A"
          rounded={50}
          resizeMode="cover"
        />
        <Heading
          w={{
            base: "72%",
            md: "25%",
          }}
          textAlign="center"
          color={colors.white}
        >
          Actualités
        </Heading>
        <Pressable onPress={() => nav.navigate("Poster")}>
          <FontAwesome name="plus" size={30} color={colors.white} />
        </Pressable>
      </HStack>
    </Box>
  );
};

export default ActualiterHeader;
