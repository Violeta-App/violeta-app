import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Alert, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid, Platform } from 'react-native';
import { alerts } from '../assets/alerts';
import { FontAwesome5 } from '@expo/vector-icons';
import { Linking } from 'react-native';
import AlertModal from "@/components/AlertModal"
import useLocation from '../hooks/useLocation'; 
import InputControls from '@/components/InputControls';



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

  // Alert
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  

  // MapView
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  useLocation(setOrigin);
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });

  const [originString, setOriginString] = useState('');
  const [destinationString, setDestinationString] = useState('');

  // Routes
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [isRouteRequested, setIsRouteRequested] = useState(false);
  const [segmentsColors, setSegmentsColors] = useState<string[]>([]);

  const [showActionButtons, setShowActionButtons] = useState(false);
  

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

  // Route calculation
  const handleSearch = () => {
    Geocoder.init(GOOGLE_MAPS_APIKEY);
  
    if (originText) {
      Geocoder.from(originText)
        .then((json) => {
          const location = json.results[0].geometry.location;
          const newOrigin = { latitude: location.lat, longitude: location.lng };
          setOrigin(newOrigin);
          setOriginString(originText);
  
          // Recentraliza o mapa na origem
          mapRef.current?.animateToRegion({
            ...newOrigin,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }, 1000); // duração da animação em ms
        })
        .catch((error) => console.warn(error));
    } else {
      alert('Adicione um ponto de partida');
      return;
    }
  
    if (destinationText) {
      Geocoder.from(destinationText)
        .then((json) => {
          const location = json.results[0].geometry.location;
          setDestination({ latitude: location.lat, longitude: location.lng });
          setDestinationString(destinationText);
        })
        .catch((error) => console.warn(error));
    } else {
      alert('Adicione um ponto de destino');
      return;
    }
  
    if (originText && destinationText) {
      setIsRouteRequested(true);
    }
  };
  
  const handleResetRoute = () => {
    setOrigin({ latitude: 0, longitude: 0 });
    setDestination({ latitude: 0, longitude: 0 });
    setOriginText('');
    setDestinationText('');
    setRouteCoordinates([]);
    setSegmentsColors([]);
    setIsRouteRequested(false);
    setShowActionButtons(false);
  };

  const callPolice = () => {
    Linking.openURL('tel:190');
  };
  
  
  const getSegmentColor = (): string => {
    const colors = ['#CF5C36', '#04724D', '#FFD936'];

    // Aqui implementaremos a lógica de obter a cor via métrica de segurança. No momento isso está sendo feito aleatoriamente.
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const handleRouteReady = (result: any) => {
    setRouteCoordinates(result.coordinates); // Retorna as coordenadas que formam a rota gerada automaticamente pelo MapViewDirections

    const colors = result.coordinates.map(() => getSegmentColor()); // Mapeia cada subsegmento da rota para uma cor
    setSegmentsColors(colors);

    setShowActionButtons(true); 
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
            <Image source={alert.photo} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
          </Marker>
        ))}

        {/* Calcula a rota entre dois pontos automaticamente */}
        {isRouteRequested && originString !== "" && destinationString !== "" && (
          <MapViewDirections
            origin={originString}
            destination={destinationString}
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
        <AlertModal 
        visible={isModalVisible} 
        alert={selectedAlert} 
        onClose={closeModal} 
      />
      )}

      {/* Inputs de Origem e Destino */}
      {!showActionButtons ? (
      <InputControls
      originText={originText}
      destinationText={destinationText}
      onChangeOrigin={setOriginText}
      onChangeDestination={setDestinationText}
      onSearchPress={handleSearch}
    />
) : (
  <View style={styles.actionButtonsContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={handleResetRoute}>
      <Text style={styles.actionButtonText}>Nova Rota</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E57373' }]} onPress={callPolice}>
      <Text style={[styles.actionButtonText, { color: '#fff' }]}>Ligar 190</Text>
    </TouchableOpacity>
  </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#CFB7EA',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2A2A2A',
    fontWeight: 'bold',
  },
  
});

export default MapScreen;
