import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Alert, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid, Platform } from 'react-native';
//import { alerts } from '../assets/alerts';

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
  occurrence_score?: number; // ← adicionado
  year: number
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyDJcZ1QMu2IpPHzNDarAfLrTRrtrBHH3_8';

const MapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);


  // Alert
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  useEffect(() => {
    fetch('https://violeta-be.onrender.com/occurrences')
      .then((response) => response.json())
      .then((data) => {
        const mappedAlerts = data.map((item: any) => ({
          latitude: item.latitude,
          longitude: item.longitude,
          title: item.main_reason,
          description: `${item.date.split('T')[0]} às ${item.time}`,
          type: `${item.occurrence_score} pontos de risco`,
          photo: require('../assets/images/alert.png'),
          occurrence_score: item.occurrence_score,
          year: parseInt(item.date.substring(0, 4), 10),
        }));
        setAlerts(mappedAlerts);
      })
      .catch((error) => {
        console.error('Erro ao buscar alertas:', error);
      });
  }, []);


  // MapView
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });

  // Routes
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [isRouteRequested, setIsRouteRequested] = useState(false);
  const [segmentsColors, setSegmentsColors] = useState<string[]>([]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão para acessar a localização',
            message: 'Este app precisa da sua localização para funcionar corretamente.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permissão concedida');
          getUserLocation();
        } else {
          Alert.alert('Permissão negada', 'A localização é necessária para usar esta funcionalidade.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    if (Platform.OS === 'ios') {
      // Code specific to iOS platform
    }
  };

  // Requesting location permission
  useEffect(() => {
    requestLocationPermission();
  }, []);
  
  const getUserLocation = () => {
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
    //console.log(region);
  };

  const onAlertSelected = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Route calculation
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

    if (originText && destinationText) {
      setIsRouteRequested(true)
    }
  };

    // Cálculo do risco de um ponto com base em todas as ocorrências 
  const calculateRiskForPoint = (point: { latitude: number, longitude: number }, alerts: AlertType[]): number => {
    let maxRisk = 0;
    let dist = 0; //for debug
    let lat = 0; //for debug
    let lon = 0; //for debug
    let risk = 0;

    alerts.forEach(alert => {
      const dx = alert.latitude - point.latitude;
      const dy = alert.longitude - point.longitude;
      const distanceSquared = dx * dx + dy * dy;
      const distance = Math.sqrt(distanceSquared);

      let year = 1;
      if (alert.year == 2024) {
        year = 1.2
      }
      else if (alert.year == 2023) {
        year = 1.5;
      }

      const score = alert.occurrence_score ?? 0; // seta para 0 se não existir
      const point_risk = (score)/(3*year) - distance*11000;
      if (point_risk > 0) {
        risk += point_risk
      }

      if (risk > maxRisk) {
        dist = distance*11000;
        maxRisk = risk;
        if (risk > 100) {
          maxRisk = 100;
        }
        lat = alert.latitude;
        lon = alert.longitude;
      }
    });
    
    //console.log(lat); //debug
    //console.log(lon); //debug
    //console.log(dist); //debug
    //console.log(maxRisk)
    return maxRisk;
  };


  const getColorFromRisk = (risk: number): string => {
    if (risk <= 20) return '#04724D'; // verde
    if (risk <= 40) return '#FFD936'; // amarelo
    return '#CF5C36'; // vermelho
  };

  const handleRouteReady = (result: any) => {
    const coordinates = result.coordinates;
    setRouteCoordinates(coordinates);
  
    const segmentColors: string[] = [];
    let totalRisk = 0;
    let segmentCount = 0;
  
    for (let i = 0; i < coordinates.length - 1; i++) {
      const pointA = coordinates[i];
      const pointB = coordinates[i + 1];
  
      const riskA = calculateRiskForPoint(pointA, alerts);
      const riskB = calculateRiskForPoint(pointB, alerts);
  
      const averageRisk = (riskA + riskB) / 2;
      totalRisk += averageRisk;
      segmentCount++;

      const segmentColor = getColorFromRisk(averageRisk);
      segmentColors.push(segmentColor);
    }
  
    setSegmentsColors(segmentColors);

    const routeAverageRisk = segmentCount > 0 ? totalRisk / segmentCount : 0;
    const safetyPercentual = 100 - routeAverageRisk;
    console.log('🚨 Segurança da rota:', safetyPercentual.toFixed(2),'%');
  };
  

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
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

        {/* Calcula a rota entre dois pontos automaticamente */}
        {isRouteRequested && origin.latitude !== 0 && destination.latitude !== 0 && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={0} // Para não renderizar a rota
            splitWaypoints={true}
            precision="low"
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={handleRouteReady}
            onError={(errorMessage) => {
              console.log('Error: ', errorMessage);
            }}
          />
        )}

        {/* Renderiza a rota gerada acima com cores diferentes para cada subsegmento */}
        {isRouteRequested && routeCoordinates.length > 0 &&
          routeCoordinates.map((_, index) => {
            if (index < routeCoordinates.length - 1) {
              const segment = [
                routeCoordinates[index], 
                routeCoordinates[index + 1]
              ];
              return (
                <Polyline
                  key={`segment-${index}`}
                  coordinates={segment}
                  strokeColor={segmentsColors[index]}
                  strokeWidth={4}
                />
              );
            }
            return null;
          })
        }
      </MapView>

      {/* Alert Modal */}
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
