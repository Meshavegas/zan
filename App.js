import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, Box } from "native-base";
import { StyleSheet } from "react-native";
import ActualiteScreen from "./src/Screens/Actualité/ActualiteScreen";
import CommentaireScreen from "./src/Screens/Actualité/CommentaireScreen";
import AddPost from "./src/Screens/Actualité/AddPost";
import HomeScreen from "./src/Screens/HomeScreen";
const LinearGradient = require("expo-linear-gradient").LinearGradient;
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/state/store";
export default function App() {
  const config = {
    dependencies: {
      "linear-gradient": LinearGradient,
    },
  };
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <NativeBaseProvider config={config}>
          <HomeScreen />
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
