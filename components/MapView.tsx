import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region, Marker, Polyline } from 'react-native-maps';
import { fetchAlerts, createAlert, deleteAlert, fetchAlertById, Alerta, AlertaInput  } from '../assets/alertas';
import Geocoder from 'react-native-geocoding';
import { Linking } from 'react-native';
import AlertModal from "@/components/AlertModal";
import useLocation from '../hooks/useLocation'; 
import InputControls from '@/components/InputControls';
import RouteButtons from '@/components/RouteButtons';
import AddAlertModal from '@/components/AddAlert';
import AlternativeRoutesButtons from './ChooseRoutesButtons';
import { decode } from '@mapbox/polyline';
import { router } from 'expo-router';

type MapScreenProps = {
  query?: string;
};

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
  occurrence_score?: number;
  year: number;
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyDJcZ1QMu2IpPHzNDarAfLrTRrtrBHH3_8'; 

export default function MapScreen({ query }: MapScreenProps) {
  const mapRef = useRef<MapView>(null);
  const [alerts, setAlert] = useState<OccType[]>([]);

  // Estados dos modais e inputs
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState('');
  const [currentRegion, setCurrentRegion] = useState<Region>();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  
  // Estados da rota
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  useLocation(setOrigin);
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });
  const [originString, setOriginString] = useState('');
  const [destinationString, setDestinationString] = useState('');
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [segmentsColors, setSegmentsColors] = useState<string[]>([]);
  const [shouldDrawRoute, setShouldDrawRoute] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Função para carregar alertas (exemplo)
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

  const loadAlertas = async () => {
    const data = await fetchAlerts();
    setAlertas(data);
  };

  useEffect(() => {
    loadAlertas();
  }, []);

  const onRegionChange = (region: Region) => {
    console.log(region);
    setCurrentRegion(region);
  };

  // ADICIONA NOVO ALERTA
  const addAlert = async (newAlert: NewAlert) => {
    if (!currentRegion) {
      console.log("Região atual não definida. Alerta não será criado.");
      return;
    }else{
      const fullAlert: AlertaInput = {
        titulo: newAlert.title,
        tipo: newAlert.type,
        descricao: newAlert.description,
        createdBy: 'Usuário', // pode ajustar se tiver login
        imagem: '../assets/images/alert.png',
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
      };
      await createAlert(fullAlert)
      await loadAlertas();
      console.log('Novo alerta adicionado:', JSON.stringify(fullAlert, null, 2));
    }
  };

  const onAlertSelected = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Função para chamar a Routes API v2 do Google e obter alternativas
  const fetchRoutesV2 = async (originLoc: { lat: number; lng: number }, destinationLoc: { lat: number; lng: number }) => {
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_MAPS_APIKEY}`;
    const payload = {
      origin: {
        location: { latLng: { latitude: originLoc.lat, longitude: originLoc.lng } }
      },
      destination: {
        location: { latLng: { latitude: destinationLoc.lat, longitude: destinationLoc.lng } }
      },
      travelMode: "DRIVE",
      computeAlternativeRoutes: true
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("Resposta da Routes API v2:", data);
      return data.routes;
    } catch (error) {
      console.error("Erro na chamada da Routes API v2:", error);
      return [];
    }
  };

  // Função de cálculo do risco para um ponto, conforme seu código
  const calculateRiskForPoint = (point: { latitude: number, longitude: number }, alerts: OccType[]): number => {
    let maxRisk = 0;
    let risk = 0;
    alerts.forEach(alert => {
      const dx = alert.latitude - point.latitude;
      const dy = alert.longitude - point.longitude;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let yearFactor = 1;
      if (alert.year === 2024) {
        yearFactor = 1.2;
      } else if (alert.year === 2023) {
        yearFactor = 1.5;
      }
      const score = alert.occurrence_score ?? 0;
      const pointRisk = score / (3 * yearFactor) - distance * 11000;
      if (pointRisk > 0) {
        risk += pointRisk;
      }
      if (risk > maxRisk) {
        maxRisk = risk > 100 ? 100 : risk;
      }
    });
    return maxRisk;
  };

  const getColorFromRisk = (risk: number): string => {
    if (risk <= 20) return '#66CDAA'; // verde
    if (risk <= 40) return '#FFD55B'; // amarelo
    return '#CF5C36'; // vermelho
  };

  const callPolice = () => {
    Linking.openURL('tel:190');
  };

  const showRouteOptions = async () => {
    if (!originText || !destinationText) return;

    setSelectedRoute(null);
    setShouldDrawRoute(false);
    setRouteCoordinates([]);
    setSegmentsColors([]);
    setIsCalculatingRoute(true);
  
    try {
      Geocoder.init(GOOGLE_MAPS_APIKEY);
      const [originRes, destinationRes] = await Promise.all([
        Geocoder.from(originText),
        Geocoder.from(destinationText),
      ]);
  
      const originLoc = originRes.results[0].geometry.location;
      const destinationLoc = destinationRes.results[0].geometry.location;
  
      const routes = await fetchRoutesV2(originLoc, destinationLoc);
      if (routes && routes.length > 0) {
        setAlternativeRoutes(routes);
      } else {
        setAlternativeRoutes([]);
      }
    } catch (err) {
      console.warn('Erro ao recarregar alternativas de rota:', err);
    } finally {
      setIsCalculatingRoute(false);
    } 
  };

  const formatDuration = (durationString: string): string => {
    const seconds = parseFloat(durationString.replace('s', ''));
    if (isNaN(seconds)) {
      return 'Tempo não disponível';
    }
    const minutes = Math.floor(seconds / 60);
    const remSeconds = Math.floor(seconds % 60);
    return `${minutes} min ${remSeconds} seg`;
  };

  // Nova função handleSearch que utiliza a Routes API v2
  const handleSearch = async () => {
    if (!originText || !destinationText) {
      alert('Preencha origem e destino');
      return;
    }
    setSelectedRoute(null);
    setIsCalculatingRoute(true);
    setRouteCoordinates([]);
    setSegmentsColors([]);
    setShouldDrawRoute(false);
  
    try {
      // Geocode dos endereços de origem e destino
      Geocoder.init(GOOGLE_MAPS_APIKEY);
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
  
      // Chama a Routes API v2 para obter as rotas alternativas
      const routes = await fetchRoutesV2(originLoc, destinationLoc);
      if (routes && routes.length > 0) {
        console.log('Número de rotas retornadas:', routes.length);
        setAlternativeRoutes(routes);
      } else {
        console.log('Nenhuma rota alternativa encontrada.');
        setAlternativeRoutes([]);
      }
      setIsCalculatingRoute(false);
    } catch (error) {
      console.warn("Erro na geocodificação ou na obtenção da rota:", error);
      setIsCalculatingRoute(false);
    }
  };

  // Ao selecionar uma rota alternativa, decodifica a polyline e prepara os estados para renderização
  const handleSelectRoute = (route: any) => {
    setSelectedRoute(route);
    setAlternativeRoutes([]); // Oculta os botões de alternativa
    
    // Supondo que a resposta da API contenha a polyline em route.polyline.encodedPolyline
    const encoded = route.polyline.encodedPolyline;
    const decodedCoordinates = decode(encoded).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
    setRouteCoordinates(decodedCoordinates);
    
    // Calcula as cores para cada segmento
    const segmentColors = [];
    for (let i = 0; i < decodedCoordinates.length - 1; i++) {
      const riskA = calculateRiskForPoint(decodedCoordinates[i], alerts);
      const riskB = calculateRiskForPoint(decodedCoordinates[i + 1], alerts);
      const avgRisk = (riskA + riskB) / 2;
      segmentColors.push(getColorFromRisk(avgRisk));
    }
    setSegmentsColors(segmentColors);
    setShouldDrawRoute(true);
  };

  const calculateRouteSafety = (route: any) => {
    let coordinates;
    // Se a rota já possuir a propriedade coordinates, use-a.
    if (route.coordinates && route.coordinates.length > 0) {
      coordinates = route.coordinates;
    } 
    // Caso contrário, verifique se existe a polyline codificada e decodifique-a.
    else if (route.polyline && route.polyline.encodedPolyline) {
      coordinates = decode(route.polyline.encodedPolyline).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
    } else {
      return 100;
    }
    
    let totalRisk = 0;
    coordinates.forEach((point: { latitude: number; longitude: number }) => {
      const risk = calculateRiskForPoint(point, alerts);
      totalRisk += risk;
    });
    
    const averageRisk = totalRisk / coordinates.length;
    const safetyPercent = Math.max(0, Math.min(100, 100 - averageRisk));
    return safetyPercent;
  };

  const handleResetRoute = () => {
    setOrigin({ latitude: 0, longitude: 0 });
    setDestination({ latitude: 0, longitude: 0 });
    setOriginText('');
    setDestinationText('');
    setRouteCoordinates([]);
    setSegmentsColors([]);
    setAlternativeRoutes([]);
    setSelectedRoute(null);
    setShouldDrawRoute(false);
    router.replace('/explore'); // ou o caminho base da sua tela de mapa

  };

  useEffect(() => {
    if (query!== undefined) {
      console.log('Query:', query);
      setDestinationText(query);
      setOriginText(`Avenida Rio Branco, 240`);
    }
  }, [query, origin]);
  
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

        {/* Renderização da rota selecionada */}
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
                  strokeWidth={6}
                />
              );
            }
            return null;
          })
        }
      </MapView>

      {/* Botões para selecionar a rota alternativa */}
      {alternativeRoutes.length > 0 && !selectedRoute && (
        <AlternativeRoutesButtons
          routes={alternativeRoutes}
          onSelectRoute={handleSelectRoute}
          calculateRouteSafety={calculateRouteSafety}
          formatDuration={formatDuration}
          destinationText={destinationText}
        />
      )}

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
      {alternativeRoutes.length === 0 && (
        !shouldDrawRoute ? (
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
            onRouteSelected={showRouteOptions}
            setAddModalVisible={setAddModalVisible}
          />

        )
      )}
    </View>
  );
};

