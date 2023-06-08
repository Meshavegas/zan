import { doc, getDoc } from "firebase/firestore";
import { HStack, Image, Text, View, VStack } from "native-base";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import moment from "moment";
import colors from "../color";
import { db } from "../Firebase/Config";

const SingleCommentaire = ({ com }) => {
  const [user, setUser] = useState({});
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const getUser = async () => {
      const usr = doc(db, "users", com.usr);
      await getDoc(usr).then((docs) => {
        setUser(docs.data());
      });
    };
    getUser();
  }, []);

  return (
    <View>
      <HStack>
        <Image
          source={{ uri: user.uri }}
          alt="pp"
          w={50}
          h={50}
          rounded={60}
          ml={1}
          mr={1}
        />
        <HStack
          bg={colors.main}
          mt={2}
          mr={3}
          mb={1}
          p={2}
          shadow={5}
          roundedBottomRight={10}
          roundedTopRight={30}
          roundedBottomLeft={30}
        >
          <HStack>
            <VStack>
              <Text fontSize={18} fontWeight="bold">
                {user.nom + " " + user.prenom}
              </Text>
              <Text fontSize={17} width={width * 0.78}>
                {com.text}
              </Text>
              <Text fontStyle="italic">
                Publié le{" "}
                {com.date.seconds
                  ? moment(new Date(com.date.seconds * 1000)).format(
                      "DD MMMM YYYY [à] HH:mm"
                    )
                  : moment(new Date(com.date)).format("DD MMMM YYYY [à] HH:mm")}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </HStack>
    </View>
  );
};

export default SingleCommentaire;
