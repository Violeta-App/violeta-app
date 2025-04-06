import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import { alerts } from '../assets/alerts';
import { fetchAlerts, createAlert, deleteAlert, fetchAlertById, Alerta, AlertaInput  } from '../assets/alertas';
import { Linking } from 'react-native';
import AlertModal from "@/components/AlertModal"
import useLocation from '../hooks/useLocation'; 
import InputControls from '@/components/InputControls';
import RouteButtons from '@/components/RouteButtons';
import AddAlertModal from '@/components/AddAlert';

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

type NewAlert = {
  title: string;
  description: string;
  type: string;
};

type AlertType = NewAlert & {
  upvotes: number;
  downvotes: number;
  createdBy: string;
  timestamp: string;
  duration: string;
  photo: any;
  latitude: number;
  longitude: number;
};

type OccType = {
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
  const [alerts, setAlert] = useState<OccType[]>([]);

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
        setAlert(mappedAlerts);
      })
      .catch((error) => {
        console.error('Erro ao buscar alertas:', error);
      });
  }, []);

  // Estados
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState('');

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [allAllerts, setAlerts] = useState(alerts);

  const loadAlertas = async () => {
    const data = await fetchAlerts();
    setAlertas(data);
  };

  useEffect(() => {
    loadAlertas();
  }, []);

  const addAlert = async (newAlert: NewAlert) => {
    const fullAlert: AlertaInput = {
      titulo: newAlert.title,
      tipo: newAlert.type,
      descricao: newAlert.description,
      createdBy: 'Usuário', // pode ajustar se tiver login
      imagem: '../assets/images/alert.png',
      latitude: origin.latitude,
      longitude: origin.longitude,
    };
    await createAlert(fullAlert)
    await loadAlertas();
    console.log('Novo alerta adicionado:', JSON.stringify(fullAlert, null, 2));
  };
  
  
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

  const [routeReadyToRender, setRouteReadyToRender] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [shouldDrawRoute, setShouldDrawRoute] = useState(false);

  

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
  const handleSearch = async () => {
    if (!originText || !destinationText) {
      alert('Preencha origem e destino');
      return;
    }
  
    Geocoder.init(GOOGLE_MAPS_APIKEY);
    setIsCalculatingRoute(true);
    setRouteCoordinates([]);
    setSegmentsColors([]);
    setShouldDrawRoute(false);
  
    try {
      const [originRes, destinationRes] = await Promise.all([
        Geocoder.from(originText),
        Geocoder.from(destinationText),
      ]);
  
      const originLoc = originRes.results[0].geometry.location;
      const destinationLoc = destinationRes.results[0].geometry.location;
  
      setOrigin({ latitude: originLoc.lat, longitude: originLoc.lng });
      setDestination({ latitude: destinationLoc.lat, longitude: destinationLoc.lng });
  
      setOriginString(originText);
      setDestinationString(destinationText);
  
      mapRef.current?.animateToRegion({
        latitude: originLoc.lat,
        longitude: originLoc.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);
  
      setIsRouteRequested(true); // Trigger MapViewDirections
    } catch (error) {
      console.warn("Erro na geocodificação:", error);
      setIsCalculatingRoute(false);
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

    // Cálculo do risco de um ponto com base em todas as ocorrências 
  const calculateRiskForPoint = (point: { latitude: number, longitude: number }, alerts: OccType[]): number => {
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


  const callPolice = () => {
    Linking.openURL('tel:190');
  };
  

  const getColorFromRisk = (risk: number): string => {
    if (risk <= 20) return '#66CDAA'; // verde
    if (risk <= 40) return '#FFD55B'; // amarelo
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
        {alertas.map((alerta) => (
          <Marker key={alerta.alerta_id} coordinate={alerta} onPress={() => onAlertSelected(alerta)}>
            <Image source={require("../assets/images/alert.png")} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
          </Marker>
        ))}

        {/* Calcula a rota entre dois pontos automaticamente */}
        {isRouteRequested && originString !== "" && destinationString !== "" && (
          <MapViewDirections
            origin={originString}
            destination={destinationString}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={0}
            splitWaypoints={true}
            precision="low"
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={(result) => {
              handleRouteReady(result); // Calcula risco e pinta os segmentos
              setShouldDrawRoute(true); // Permite desenhar a rota
              setIsCalculatingRoute(false);
              setIsRouteRequested(false); // Evita múltiplas chamadas
            }}
            
            onError={(errorMessage) => {
              console.log('Error: ', errorMessage);
            }}
          />
        )}


        {/* Renderiza a rota gerada acima com cores diferentes para cada subsegmento */}
        {shouldDrawRoute && routeCoordinates.length > 0 &&
          routeCoordinates.map((_, index) => {
            if (index < routeCoordinates.length - 1) {
              const segment = [
                routeCoordinates[index],
                routeCoordinates[index + 1],
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
        <AddAlertModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSubmit={addAlert}
          title={newTitle}
          setTitle={setNewTitle}
          description={newDescription}
          setDescription={setNewDescription}
          type={newType}
          setType={setNewType}
        />
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
      <RouteButtons
        destinationText={destinationText}
        onResetRoute={handleResetRoute}
        onCallPolice={callPolice}
        setAddModalVisible={setAddModalVisible}
      />
)}
    </View>
  );
};

export default MapScreen;