import {
  Box,
  Heading,
  Input,
  ScrollView,
  Pressable,
  Text,
  View,
  Button,
  Image,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  useToast,
} from "native-base";
import React, { useState } from "react";
import colors from "../color";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import BoxForme from "../Components/BoxForme";
// import { auth} from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Config";
const RegisterScreen = ({ navigation }) => {
  const statusArray = [
    {
      status: "success",
      title: "Selection successfully moved!",
    },
    {
      status: "error",
      title: "Tout les champs doivent etre renseigner",
    },
  ];
  const [password, setPassword] = useState("");
  const [RPassword, setRPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telePhone, setTelePhone] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleInscription = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    console.log(RPassword, " ", password);
    if (
      nom.length > 3 &&
      regex.test(email) === true &&
      password.length > 6 &&
      password === RPassword
    ) {
      setLoading(true);
      let data = {
        id: Math.round(new Date().getTime() / 100),
        nom: nom,
        prenom: prenom,
        telephone: telePhone,
        email: email,
        password: RPassword,
        inscritLe: new Date(),
        uri: "",
      };
      handleSubmit(data);
    } else {
      toast.show({
        render: () => {
          return (
            <Box bg={colors.primary} px="2" py="1" rounded="sm" mb={5}>
              <Text color={colors.white}>Veuillez remplir tout les champs</Text>
            </Box>
          );
        },
        placement: "bottom",
      });
    }
  };
  const handleSubmit = async (data) => {
    console.log(password, "data => ", data);

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        const uid = response.user.uid;
        const ref = collection(db, "users");
        setDoc(doc(ref, uid), data);
        toast.show({
          render: () => {
            return (
              <Box bg={colors.main} px="2" py="1" rounded="sm" mb={5}>
                <Text color={colors.white}>Inscription reuisit</Text>
              </Box>
            );
          },
          placement: "bottom",
        });
        setLoading(false);

        navigation.navigate("Login");
      })
      .catch((err) => {
        setLoading(false);
        toast.show({
          render: () => {
            return (
              <Box bg={colors.main} px="2" py="1" rounded="sm" mb={5}>
                <Text color={colors.white}>La réquete a echouer</Text>
              </Box>
            );
          },
          placement: "bottom",
        });
      });
  };
  const HandleConnect = () => {
    navigation.navigate("Login");
  };
  return (
    <>
      <ScrollView
        flex={1}
        w={["full", "full"]}
        h="full"
        bg={colors.white}
        showsVerticalScrollIndicator={false}
        variant="scroll"
      >
        <BoxForme type="second" />
        <View
          justifyContent="center"
          alignItems="center"
          bg={colors.white}
          mb={20}
          pb={20}
          pt={10}
          style={{ marginTop: -42 }}
          roundedTopRight={50}
          roundedTopLeft={50}
        >
          <Heading fontSize={30} color={colors.primary}>
            Inscription
          </Heading>
          <Input
            mt={2}
            bg={colors.main}
            borderColor={colors.white}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={"text"}
            InputLeftElement=<Box mx="3">
              <FontAwesome name="user" size={25} ml="2" color="muted.400" />
            </Box>
            placeholder="Nom "
            onChangeText={(e) => setNom(e)}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />
          <Input
            mt={2}
            bg={colors.main}
            borderColor={colors.white}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={"text"}
            InputLeftElement=<Box mx="3">
              <FontAwesome name="user" size={25} ml="2" color="muted.400" />
            </Box>
            placeholder="Prenom"
            onChangeText={(e) => setPrenom(e)}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />
          <Input
            bg={colors.main}
            borderColor={colors.white}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={"number"}
            InputLeftElement=<Box mx="3">
              <FontAwesome name="phone" size={20} ml="2" color="muted.400" />
            </Box>
            placeholder="Téléphone"
            onChangeText={(e) => setTelePhone(e)}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
            mt={2}
          />
          <Input
            bg={colors.main}
            borderColor={colors.white}
            w={{
              base: "75%",
              md: "25%",
            }}
            mt={2}
            type={"text"}
            InputLeftElement=<Box mx="3">
              <FontAwesome name="envelope" size={20} ml="2" color="muted.400" />
            </Box>
            placeholder="Email"
            onChangeText={(e) => setEmail(e)}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />
          <Input
            mt={2}
            bg={colors.main}
            borderColor={colors.white}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={showPassword ? "text" : "password"}
            InputLeftElement=<Box mx="3">
              <MaterialIcons name="lock" size={25} ml="2" color="muted.400" />
            </Box>
            InputRightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)} mx="3">
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={25}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
            placeholder="Mots de Passe"
            onChangeText={(e) => setPassword(e)}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />
          <Input
            mt={2}
            bg={colors.main}
            borderColor={colors.white}
            w={{
              base: "75%",
              md: "25%",
            }}
            type={showPassword ? "text" : "password"}
            InputLeftElement=<Box mx="3">
              <MaterialIcons name="lock" size={25} ml="2" color="muted.400" />
            </Box>
            InputRightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)} mx="3">
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={25}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
            placeholder="Confirmer Mot de Passe"
            onChangeText={(e) => setRPassword(e)}
            _focus={{
              bg: colors.white,
              borderColor: colors.primary,
            }}
          />

          <Pressable w={{ base: "75%", md: "25%" }} mt={2} shadow={70}>
            <Button
              isLoading={loading}
              onPress={handleInscription}
              variant="solid"
              colorScheme="amber"
              fontStyle="italic"
              _spinner={{
                color: "white",
              }}
              isLoadingText="Inscription..."
            >
              S'inscrire
            </Button>
          </Pressable>
          <Pressable onPress={HandleConnect}>
            <Text mt={5}>
              déjà inscrit ?<Text color={colors.primary}> Se Connecter</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};

export default RegisterScreen;
