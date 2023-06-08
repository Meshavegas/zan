import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "firebase/firestore";
import { Box, Image, Text, View } from "native-base";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { RefreshControl } from "react-native";
import { useWindowDimensions, ScrollView } from "react-native";
import colors from "../../color";
import ActualiterHeader from "../../Components/ActualiterHeader";
import BallAnimation from "../../Components/BallAnimation";
import SingleActualite from "../../Components/SingleActualite";
import { db } from "../../Firebase/Config";

const ActualiteScreen = ({ navigation }) => {
  const { height, width } = useWindowDimensions();

  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef();
  const slowlyScrollDown = () => {
    console.log("offSet", offset);
    const y = offset + 80;
    scrollViewRef.current.scrollTo({ x: 0, y, animated: true });
    setOffset(y);
  };

  const [actulites, setActualites] = useState([]);
  const onRefresh = () => {
    setRefreshing(true);

    const q = query(collection(db, "pub"), orderBy("date", "desc"));

    let list = [];
    onSnapshot(q, (snapShot) => {
      snapShot.docs.forEach((doc) => {
        let obj = doc.data();
        list.push(obj);
      });
      setActualites(list);
      setRefreshing(false);
    });
  };
  useEffect(() => {
    const getPub = async () => {
      const q = query(collection(db, "pub"), orderBy("date", "desc"));

      let list = [];
      onSnapshot(q, (snapShot) => {
        snapShot.docs.forEach((doc) => {
          let obj = doc.data();
          list.push(obj);
        });
        setActualites(list);
      });
    };
    getPub();
  }, []);

  return (
    <View flex={1} alignItems="center">
      <Box h={2} bg={colors.primary} width="full" safeAreaTop />
      <ScrollView
        style={{
          width: "100%",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ActualiterHeader nav={navigation} />
        {actulites.length === 0 ? (
          <View flex={1} justifyContent="center" alignItems="center">
            <BallAnimation />
          </View>
        ) : (
          actulites.map((ac, key) => <SingleActualite data={ac} key={key} />)
        )}
      </ScrollView>
    </View>
  );
};

export default ActualiteScreen;
