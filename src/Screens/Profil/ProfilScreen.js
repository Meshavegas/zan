import { Image, ScrollView, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import BackPicture from "../../Components/profil/BackPicture";
import BadgeUser from "../../Components/profil/BadgeUser";
import ProfilTab from "../../Components/profil/ProfilTab";
import { useWindowDimensions } from "react-native";
import { getAuth } from "firebase/auth";

const ProfilScreen = ({ userId }) => {
  const { height, width } = useWindowDimensions();
  const [user, setUser] = useState();
  useEffect(() => {
    if (userId === undefined) {
      const auth = getAuth();
      const user = auth.currentUser;
      setUser(user.uid);
    } else {
      setUser(userId);
    }
  }, []);

  return (
    <View justifyContent={"center"} alignItems="center" h={height} w={width}>
      <BackPicture />
      <BadgeUser userId={user} />
      <ProfilTab userId={user} />
    </View>
  );
};

export default ProfilScreen;
