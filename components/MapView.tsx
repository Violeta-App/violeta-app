import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions, Image, Alert, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker, Callout } from 'react-native-maps';
import { markers } from '../assets/markers'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const INITIAL_REGION = {
  latitude: -8.060511,
  longitude: -34.870314,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

interface MapScreenProps {
  // Você pode adicionar props específicas aqui conforme necessário
}

const MapScreen: React.FC<MapScreenProps> = () => {
  const mapRef = useRef<MapView>(null);

  const onRegionChange = (region: Region) => {
    console.log(region)
  }

  const onMarkerSelected = (marker: any) => {
    Alert.alert(marker.name)
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsTraffic={false}
        moveOnMarkerPress={false}
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            onPress={() => onMarkerSelected(marker)}
            anchor={{ x: 0.5, y: 1 }} // Posicionando imagem
          >
            <Image
              source={require('../assets/images/alert.png')}
              style={{ width: 40, height: 40 }} // Redimensionando a imagem
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;