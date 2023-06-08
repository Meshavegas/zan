import { View, Text, Modal } from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../Firebase/Config";
import { Center, Pressable, ScrollView } from "native-base";
import SinglePhotos from "./SinglePhotos";
import ImageViewer from "react-native-image-zoom-viewer";

const ProfilPhotos = ({ pub }) => {
  const [publi, setPubli] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pub === undefined) {
      setPubli([]);
    } else {
      setPubli(pub);
      let dat = [];
      pub.forEach(function (obj) {
        let datatem = obj.uri.map(function (o) {
          return o.type === "photo" && { url: o.uri };
        });
        if (datatem.length > 0) {
          for (let index = 0; index < datatem.length; index++) {
            dat.push(datatem[index]);
          }
        }
      });

      setDataView(dat);
    }
  }, [pub]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Center>
        <Pressable onPress={() => setVisible(true)}>
          <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
            {publi.map((data, index) => (
              <SinglePhotos data={data} key={index} />
            ))}
          </View>
        </Pressable>

        <Modal visible={visible} transparent={true}>
          <ImageViewer
            imageUrls={dataView}
            onSwipeDown={() => setVisible(false)}
            enableSwipeDown={true}
          />
        </Modal>
      </Center>
    </ScrollView>
  );
};

export default ProfilPhotos;
