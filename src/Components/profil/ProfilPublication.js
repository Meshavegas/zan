import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FlatList } from "native-base";
import SingleActualite from "../SingleActualite";
import { db } from "../../Firebase/Config";

const ProfilPublication = ({ pub }) => {
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8F8C8",
        }}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={pub}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={({ item }) => <SingleActualite data={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ProfilPublication;
