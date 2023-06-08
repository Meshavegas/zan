import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActualiteScreen from "../Screens/Actualité/ActualiteScreen";
import CommentaireScreen from "../Screens/Actualité/CommentaireScreen";
import AddPost from "../Screens/Actualité/AddPost";

const Stack = createNativeStackNavigator();
const Stacked = () => {
  return (
    <Stack.Navigator
      initialRouteName="Actualite"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Actualite" component={ActualiteScreen} />
      {/* <Stack.Screen name="Commentaire" component={CommentaireScreen} /> */}
      <Stack.Screen
        name="Poster"
        component={AddPost}
        options={{
          title: "Faire un poste",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default Stacked;
