import {
  Box,
  Center,
  HStack,
  Pressable,
  Text,
  View,
  useColorModeValue,
} from "native-base";
import * as React from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { MaterialIcons } from "@expo/vector-icons";
import ProfilPublication from "./ProfilPublication";
import ProfilPhotos from "./ProfilPhotos";
import ProfilVideos from "./ProfilVideos";
import { useState } from "react";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Firebase/Config";

const ProfilTab = ({ userId }) => {
  const initialLayout = {
    width: Dimensions.get("window").width,
  };
  const { height, width } = useWindowDimensions();
  const [pub, setPub] = useState([]);
  useEffect(() => {
    if (userId === undefined) {
      const auth = getAuth();
      const user = auth.currentUser;
      const getPub = () => {
        const q = query(
          collection(db, "pub"),
          orderBy("date", "desc"),
          where("autheur", "==", user.uid)
        );

        let list = [];
        onSnapshot(q, (snapShot) => {
          snapShot.docs.forEach((doc) => {
            let obj = doc.data();
            list.push(obj);
          });
          setPub(list);
        });
      };
      getPub();
    }
  }, []);
  const renderScene = SceneMap({
    first: () => <ProfilPublication pub={pub} />,
    second: () => <ProfilPhotos pub={pub} />,
    third: () => <ProfilVideos pub={pub} />,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "first",
      title: "Pub",
      icon: "library-books",
    },
    {
      key: "second",
      title: "Photos",
      icon: "insert-photo",
    },
    {
      key: "third",
      title: "Vidéos",
      icon: "video-collection",
    },
  ]);

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const textColors = index === i ? "#f77f00" : "#000000";
          const color =
            index === i
              ? useColorModeValue("#000", "#e5e5e5")
              : useColorModeValue("#1f2937", "#a1a1aa");
          const borderColor =
            index === i
              ? "warning.500"
              : useColorModeValue("coolGray.200", "gray.400");
          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              alignItems="center"
              p="3"
              w={width * 0.33}
              key={route.key}
              cursor="pointer"
            >
              <Pressable
                onPress={() => {
                  console.log(i);
                  setIndex(i);
                }}
              >
                <View w={width * 0.25}>
                  <HStack justifyContent={"center"} alignItems={"center"}>
                    <MaterialIcons
                      name={route.icon}
                      size={24}
                      color={textColors}
                    />
                    <Text fontSize={"lg"} color={textColors}>
                      {route.title}
                    </Text>
                  </HStack>
                </View>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <TabView
      swipeEnabled={true}
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{
        marginTop: StatusBar.currentHeight,
      }}
    />
  );
};

export default ProfilTab;
