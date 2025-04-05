import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function MapPicker({ onSelectLocation }) {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker(loc.coords);
      onSelectLocation(loc.coords);
    })();
  }, []);

  const handleMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setMarker(coords);
    onSelectLocation(coords);
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {marker && <Marker coordinate={marker} />} 
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
