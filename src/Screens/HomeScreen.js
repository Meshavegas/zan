import { Text, View, Image, Heading, Button, Box } from "native-base";
import React, { useState } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import SliderData from "../Data/Sliders";
import Colors from "../color";
import ActualiteScreen from "./Actualité/ActualiteScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import Navigator from "../Navigation/Navigator";
import CommentaireScreen from "./Actualité/CommentaireScreen";
import AddPost from "./Actualité/AddPost";
import DiscutionScreen from "./Messages/DiscutionScreen";

const HomeScreen = () => {
  const [showRealApp, setShowRealApp] = useState(false);

  const Stack = createNativeStackNavigator();

  const onDone = () => {
    console.log("done");
    setShowRealApp(true);
  };
  const onSkip = () => {
    console.log("skip");
    setShowRealApp(true);
  };
  const RenderItem = ({ item }) => {
    return (
      <View
        flex={1}
        bg={Colors.lightblack}
        justifyContent="center"
        alignItems="center"
        paddingX="2.5"
      >
        <Heading textAlign="center">{item.title}</Heading>
        <Image
          source={item.image}
          alt="Joeur"
          resizeMode="contain"
          w="70%"
          h="40%"
        />
        <Text fontSize="xl" textAlign="justify">
          {item.text}
        </Text>
      </View>
    );
  };
  const actionBtn = (nom, color) => {
    return (
      <Box alignItems="center" bg={color} p="3" rounded={15}>
        <Text>{nom}</Text>
      </Box>
    );
  };
  return (
    <>
      {showRealApp ? (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Singin" component={RegisterScreen} />
            <Stack.Screen name="Home" component={Navigator} />
            <Stack.Screen
              name="Commentaire"
              options={{
                headerShown: true,
              }}
              component={CommentaireScreen}
            />
            <Stack.Screen
              name="Discussion"
              options={{
                headerShown: true,
              }}
              component={DiscutionScreen}
            />
            <Stack.Screen
              name="Poster"
              component={AddPost}
              options={{
                title: "Faire un poste",
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <AppIntroSlider
          data={SliderData}
          renderItem={RenderItem}
          onDone={onDone}
          showSkipButton={true}
          onSkip={onSkip}
          doneLabel={actionBtn("Commencer", Colors.main)}
          skipLabel={actionBtn("Passer", Colors.primary)}
          nextLabel={actionBtn("Suivant", Colors.lightwhite)}
          dotStyle={{ backgroundColor: "#A9A9A9" }}
          activeDotStyle={{ backgroundColor: Colors.white }}
        />
      )}
    </>
  );
};

export default HomeScreen;
