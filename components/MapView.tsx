import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

// 🔑 Substitua pela sua chave da API do Google Maps
const GOOGLE_MAPS_APIKEY = "AIzaSyDJcZ1QMu2IpPHzNDarAfLrTRrtrBHH3_8";


// Tipagem de dados
interface MapViewComponentProps {
  region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({ region }) => {
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      }
    })();
  }, []);

  if (!region) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
        customMapStyle={customMapStyle}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setDestination({ latitude, longitude });
          Alert.alert("Destino Selecionado", `Destino definido em: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }}
        >
        {/* Renderiza o destino escolhido pelo usuário */}
        {destination && (
          <Marker coordinate={destination} title="Destino Selecionado" pinColor="blue" />
        )}

        {/* Renderiza a rota entre a localização do usuário e o destino */}
        {userLocation && destination && (
          <MapViewDirections
            origin={userLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="blue"
            mode="WALKING"
            optimizeWaypoints={true}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapViewComponent;

const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#F4F4F9" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#2A2A2A" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#F4F4F9" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#CFD2B2" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#CFD2B2" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "geometry",
    stylers: [{ color: "#E2D6F2" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "labels.text.fill",
    stylers: [{ color: "#553D6E" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#553D6E" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#A97ADB" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#C7D7FF" }],
  },
];
