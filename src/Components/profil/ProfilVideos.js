import React, { useEffect, useState } from "react";
import { Center, ScrollView, View } from "native-base";
import SingleVideo from "./SingleVideo";

const ProfilVideos = ({ pub }) => {
  const [publi, setPubli] = useState([]);
  useEffect(() => {
    if (pub === undefined) {
      setPubli([]);
    } else {
      setPubli(pub);
    }
  }, [pub]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Center>
        <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
          {publi.map((data, index) => (
            <SingleVideo data={data} key={index} />
          ))}
        </View>
      </Center>
    </ScrollView>
  );
};

export default ProfilVideos;
