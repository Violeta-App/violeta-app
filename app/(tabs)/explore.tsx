import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import MapViewComponent from "../../components/MapView";

export default function ExploreScreen() {
  const [region, setRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "É necessário permitir o acesso à localização para exibir o mapa.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Passando a região para o componente do mapa */}
      <MapViewComponent region={region} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
