import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapViewComponent from "../../components/MapView";

export default function ExploreScreen() {
  const [region] = useState({
    latitude: -8.053971,
    longitude: -34.881715,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <View style={styles.container}>
      {/* Renderiza o mapa com a região fixa */}
      <MapViewComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});