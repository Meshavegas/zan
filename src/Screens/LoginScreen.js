import {
  View,
  Center,
  Input,
  VStack,
  Pressable,
  Text,
  Box,
  ScrollView,
  Heading,
  Button,
} from "native-base";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import BoxForme from "../Components/BoxForme";
import colors from "../color";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../Firebase/Config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getItemFor, storeData } from "../reducer/StrorageHelper";
import { useEffect } from "react";

const Loged = "LOG_ID";
export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [loged, setLoged] = React.useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const getUserID = async () => {
      if (user) {
        setLoged(await getItemFor(Loged));
      } else {
        await removeKey(Loged);
        navigation.navigate("Login");
      }
    };
    getUserID();
    if (user) {
      navigation.navigate("Home");
    }
  }, [loged]);

  const saveID = async (e) => {
    await storeData(Loged, e);
    console.log("Saved ", e);
  };
  const handleConnect = () => {
    if (email.length > 0 && password.length > 0) {
      setLoading(true);
      console.log("Mail et MDP", email, password);
      signInWithEmailAndPassword(auth, email, password)
        .then((Response) => {
          saveID(Response.user.uid);
          setLoading(false);

          navigation.navigate("Home");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          setIsError(true);
        });
    } else {
      setIsError(true);
    }
  };
  const onchangeEmail = (e) => {
    console.log(e);
  };
  return (
    <View bg={colors.main} flex={1}>
      <BoxForme />
      <ScrollView w="full">
        <VStack space={4} alignItems="center" mt={10}>
          <Heading>Connexion</Heading>
          <Input
            bg={colors.lightwhite}
            borderColor={colors.main}
            w={{
              base: "75%",
              md: "25%",
            }}
            InputLeftElement={
              <Box mx="3">
                <FontAwesome
                  name="envelope"
                  size={20}
                  ml="2"
                  color={colors.lightgray}
                />
              </Box>
            }
            placeholder="Adresse Email"
            onChangeText={(e) => {
              setEmail(e);
              setIsError(false);
            }}
            type="email"
            value={email}
            validateText={true}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />
          <Input
            bg={colors.lightwhite}
            borderColor={colors.main}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={showPassword ? "text" : "password"}
            InputLeftElement=<Box mx="3">
              <MaterialIcons
                name="lock"
                size={25}
                ml="2"
                color={colors.lightgray}
              />
            </Box>
            InputRightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)} mx="3">
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={25}
                  mr="2"
                  color={colors.lightgray}
                />
              </Pressable>
            }
            placeholder="Mots de Passe"
            onChangeText={(e) => {
              setPassword(e);
              setIsError(false);
            }}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />
          {isError ? (
            <Text fontSize={14} color={"red.600"}>
              Mot de passe ou address mail incorect!
            </Text>
          ) : null}
          <Button
            w={{
              base: "75%",
              md: "25%",
            }}
            variant="solid"
            shadow={50}
            colorScheme="amber"
            onPress={handleConnect}
            isLoading={loading}
            _spinner={{
              color: "white",
            }}
            isLoadingText="Connexion..."
          >
            Se Connecter
          </Button>
          <Box justifyContent="center" alignItems="center">
            <Pressable onPress={() => navigation.navigate("Singin")}>
              <Text fontSize="xl">
                Pas encore inscrit ?
                <Text fontSize="xl" color={colors.primary}>
                  {" "}
                  S'inscrire
                </Text>
              </Text>
            </Pressable>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}
