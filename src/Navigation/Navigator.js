import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Stacked from "./Stacked";
import { Center, Pressable } from "native-base";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import colors from "../color";
import ProfilScreen from "../Screens/Profil/ProfilScreen";
import ChampionatScreen from "../Screens/Championat/ChampionatScreen";
const tab = createBottomTabNavigator();
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import MessageScreen from "../Screens/Messages/MessagesScreen";
const CustomTab = ({ children, onPress }) => (
  <Pressable onPress={onPress} bg={colors.primary} rounded="full" shadow="5">
    {children}
  </Pressable>
);

const Navigator = () => {
  return (
    <tab.Navigator
      backBehavior="main"
      initialRouteName="main"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { ...styles.tab },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <tab.Screen
        name="Main"
        component={Stacked}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <AntDesign name="home" size={34} color={colors.main} />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              )}
            </Center>
          ),
        }}
      />
      <tab.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <Octicons
                  name="comment-discussion"
                  size={24}
                  color={colors.main}
                />
              ) : (
                <Octicons name="comment-discussion" size={24} />
              )}
            </Center>
          ),
        }}
      />
      <tab.Screen
        name="Championat"
        component={ChampionatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <FontAwesome
                  name="soccer-ball-o"
                  size={24}
                  color={colors.white}
                />
              ) : (
                <FontAwesome name="soccer-ball-o" size={25} />
              )}
            </Center>
          ),
        }}
      />
      <tab.Screen
        name="Profile"
        component={ProfilScreen}
        options={{
          headerShadowVisible: true,
          tabBarIcon: ({ focused }) => (
            <Center>
              {focused ? (
                <AntDesign name="user" size={34} color={colors.main} />
              ) : (
                <AntDesign name="user" size={30} color="black" />
              )}
            </Center>
          ),
        }}
      />
    </tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tab: {
    elevation: 0,
    backgroundColor: colors.primary,
    height: 50,
  },
});
export default Navigator;
