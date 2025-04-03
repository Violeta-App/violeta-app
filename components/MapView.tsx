import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Alert, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid } from 'react-native';
import { alerts } from '../assets/alerts';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const INITIAL_REGION = {
  latitude: -8.060511,
  longitude: -34.870314,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

type AlertType = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  type: string;
  photo: any;
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyDJcZ1QMu2IpPHzNDarAfLrTRrtrBHH3_8';

const MapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');

  useEffect(() => {
    // Solicitar permissões de localização no Android
    const requestLocationPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission to access location',
          message: 'We need your location to show directions',
          buttonPositive: 'OK',  // Adicione isso
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert('Location permission denied');
      }
    };    

    requestLocationPermission();
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOrigin({ latitude, longitude });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
  };

  const onRegionChange = (region: Region) => {
    console.log(region);
  };

  const onAlertSelected = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = () => {
    if (originText) {
      Geocoder.init(GOOGLE_MAPS_APIKEY);
      Geocoder.from(originText)
        .then((json) => {
          const location = json.results[0].geometry.location;
          setOrigin({ latitude: location.lat, longitude: location.lng });
        })
        .catch((error) => console.warn(error));
    } else {
      alert('Please enter an origin address');
    }

    if (destinationText) {
      Geocoder.init(GOOGLE_MAPS_APIKEY);
      Geocoder.from(destinationText)
        .then((json) => {
          const location = json.results[0].geometry.location;
          setDestination({ latitude: location.lat, longitude: location.lng });
        })
        .catch((error) => console.warn(error));
    } else {
      alert('Please enter a destination address');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
      >
        {alerts.map((alert, index) => (
          <Marker key={index} coordinate={alert} onPress={() => onAlertSelected(alert)}>
            <Image source={alert.photo} style={{ width: 30, height: 30 }} />
          </Marker>
        ))}

        {origin.latitude !== 0 && destination.latitude !== 0 && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>

      {/* Modal */}
      {selectedAlert && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={selectedAlert.photo} style={styles.alertImage} />
              <Text style={styles.alertTitle}>{selectedAlert.title}</Text>
              <Text style={styles.alertDescription}>{selectedAlert.description}</Text>
              <Text style={styles.alertType}>{`Tipo: ${selectedAlert.type}`}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Inputs de Origem e Destino */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOriginText(text)}
          placeholder="Origem"
          value={originText}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setDestinationText(text)}
          placeholder="Destino"
          value={destinationText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar Rota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  alertDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  alertType: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default MapScreen;
