import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert, Modal, TextInput, SafeAreaView, ScrollView } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import * as Location from "expo-location";

const GOOGLE_MAPS_APIKEY = "AIzaSyDJcZ1QMu2IpPHzNDarAfLrTRrtrBHH3_8";

// Pontos turísticos em Recife
const touristAttractions = [
  { position: { latitude: -8.0476, longitude: -34.8770 }, title: "Marco Zero", description: "Praça histórica no centro de Recife" },
  { position: { latitude: -8.0632, longitude: -34.8711 }, title: "Rua do Bom Jesus", description: "Rua histórica em Recife Antigo" },
  { position: { latitude: -8.0539, longitude: -34.8713 }, title: "Paço do Frevo", description: "Museu dedicado ao frevo" },
  { position: { latitude: -8.0413, longitude: -34.8813 }, title: "Instituto Ricardo Brennand", description: "Museu com coleção de arte e armas" },
  { position: { latitude: -8.0157, longitude: -34.9456 }, title: "Oficina de Cerâmica Francisco Brennand", description: "Exposição de cerâmica e esculturas" },
];

// Alertas de segurança
type SafetyAlert = {
  location: { latitude: number; longitude: number };
  message: string;
  type: AlertType;
  time: string;
};

const safetyAlerts: SafetyAlert[] = [
  { location: { latitude: -8.0539, longitude: -34.8713 }, message: "Rua pouco movimentada", type: "movimento", time: "Há 2 horas" },
  { location: { latitude: -8.0476, longitude: -34.8770 }, message: "Assalto recente", type: "crime", time: "Ontem" },
  { location: { latitude: -8.0632, longitude: -34.8711 }, message: "Iluminação precária", type: "iluminação", time: "Há 3 dias" },
  { location: { latitude: -8.0413, longitude: -34.8813 }, message: "Risco de assalto após 22h", type: "horário", time: "Semana passada" },
];


// Definir os tipos possíveis de alerta
type AlertType = "crime" | "movimento" | "iluminação" | "horário";

type Attraction = {
  position: { latitude: number; longitude: number };
  title: string;
  description: string;
};

const getAlertColor = (type: AlertType): string => {
  const colors: Record<AlertType, string> = {
    "crime": "#CF5C36", // Vermelho
    "movimento": "#A49B3A", // Amarelo
    "iluminação": "#7954A1", // Roxo
    "horário": "#04724D" // Verde escuro
  };

  return colors[type];
};


const MapComponent = () => {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: -8.053971,
    longitude: -34.881715,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [userLocation, setUserLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [showAttractions, setShowAttractions] = useState(true);
  const [showSafetyAlerts, setShowSafetyAlerts] = useState(true);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [safetyRoute, setSafetyRoute] = useState<LocationCoords[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showRouteInfo, setShowRouteInfo] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showAddAlertModal, setShowAddAlertModal] = useState(false);
  const [newAlertMessage, setNewAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("movimento");
  const [votes, setVotes] = useState<VotesState>({});
  const [votedAlerts, setVotedAlerts] = useState<string[]>([]);  
  const [seenAlerts, setSeenAlerts] = useState<string[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);

  type LocationCoords = { latitude: number; longitude: number };

  // Inicializar localização do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização necessária', 'Por favor, permita acesso à sua localização para usar todos os recursos.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log('Erro ao obter localização:', error);
      }
    })();
  }, []);

  const checkNearbyAlerts = (centerLocation: LocationCoords) => {
    if (!centerLocation) return;
  
    safetyAlerts.forEach(alert => {
      // Calcular distância simplificada
      const distance = Math.sqrt(
        Math.pow(centerLocation.latitude - alert.location.latitude, 2) +
        Math.pow(centerLocation.longitude - alert.location.longitude, 2)
      ) * 111000; // Converter para metros aproximadamente
  
      if (distance < 300 && !seenAlerts.includes(alert.message)) {
        Alert.alert(
          `⚠️ ${alert.message}`,
          `Última atualização: ${alert.time}\n\nConfirma este alerta?`,
          [
            { text: "👍", onPress: () => handleVote(alert.message, 'up') },
            { text: "👎", onPress: () => handleVote(alert.message, 'down') },
            { text: "Fechar", style: "cancel" }
          ]
        );
        setSeenAlerts([...seenAlerts, alert.message]);
      }
    });
  };  

// Tipagem para os votos individuais
type VoteCounts = {
  up: number;
  down: number;
};

// O estado de votos será um objeto onde cada chave é uma string (mensagem do alerta)
type VotesState = Record<string, VoteCounts>;

// O tipo de voto pode ser apenas "up" ou "down"
type VoteType = "up" | "down";


const handleVote = (alertMessage: string, type: VoteType) => {
  if (votedAlerts.includes(alertMessage)) {
    Alert.alert("Você já votou neste alerta!");
    return;
  }

  setVotes((prevVotes) => {
    // Criamos uma cópia do estado anterior
    const newVotes: VotesState = { ...prevVotes };

    // Se o alerta ainda não tem votos, inicializamos
    if (!newVotes[alertMessage]) {
      newVotes[alertMessage] = { up: 0, down: 0 };
    }

    // ✅ Incrementar apenas a chave correta (garantindo que `type` é válido)
    newVotes[alertMessage][type] += 1;

    return newVotes;
  });

  setVotedAlerts((prev) => [...prev, alertMessage]);
};


  // Adicionar novo alerta no mapa
  const handleAddAlert = () => {
    if (!newAlertMessage.trim()) {
      Alert.alert("Mensagem necessária", "Por favor, descreva o problema.");
      return;
    }

    const newAlert = {
      location: {
        latitude: region.latitude,
        longitude: region.longitude
      },
      message: newAlertMessage,
      type: alertType,
      time: "Agora mesmo"
    };

    // Adicionar ao array de alertas (em uma implementação real, isso enviaria para um servidor)
    safetyAlerts.push(newAlert);
    setNewAlertMessage("");
    setShowAddAlertModal(false);
    Alert.alert("Alerta registrado!", "Obrigado por contribuir para a segurança.");
  };

  // Tipo para segmentos da rota
  type RouteSegment = {
    coordinates: LocationCoords[];
    color: string;
    safetyLevel: number;
  };

  // Tipo para as informações da rota calculada
  type RouteInfo = {
    distance: string;
    duration: string;
    safety: string;
  };

  const calculateRouteTo = (destination: LocationCoords) => {
    if (!userLocation) {
      Alert.alert("Localização não disponível", "Não foi possível obter sua localização atual.");
      return;
    }
  
    // Simular cálculo de rota (em uma implementação real, usaria uma API de rotas)
    const origin = userLocation;
    const numPoints = 10;
    const route: LocationCoords[] = [];
  
    for (let i = 0; i <= numPoints; i++) {
      route.push({
        latitude: origin.latitude + (destination.latitude - origin.latitude) * (i / numPoints),
        longitude: origin.longitude + (destination.longitude - origin.longitude) * (i / numPoints)
      });
    }
  
    // Simular níveis de segurança em diferentes segmentos da rota
    const segments: RouteSegment[] = [];
    for (let i = 0; i < route.length - 1; i++) {
      const relativePosInRoute = i / (route.length - 1);
      let safetyLevel;
  
      if (relativePosInRoute > 0.3 && relativePosInRoute < 0.6) {
        safetyLevel = 5 + Math.random() * 3; // Segurança média (5-8)
      } else {
        safetyLevel = 8 + Math.random() * 2; // Segurança alta (8-10)
      }
  
      let segmentColor;
      if (safetyLevel >= 8) {
        segmentColor = "#04724D"; // Verde - muito seguro
      } else if (safetyLevel >= 6) {
        segmentColor = "#A49B3A"; // Amarelo - moderadamente seguro
      } else {
        segmentColor = "#CF5C36"; // Vermelho - menos seguro
      }
  
      segments.push({
        coordinates: [route[i], route[i + 1]],
        color: segmentColor,
        safetyLevel: safetyLevel
      });
    }
  
    // Simular dados de distância e duração (em uma implementação real, usar API de mapas)
    const simulatedDistance = "2.5 km";
    const simulatedDuration = "30 minutos a pé";
    const simulatedSafety = "8.5/10";
  
    setSafetyRoute(route);
    setRouteSegments(segments);
    setRouteInfo({
      distance: simulatedDistance,
      duration: simulatedDuration,
      safety: simulatedSafety
    });
    setShowRouteInfo(true);
  
    // Garantir que o mapa está acessível antes de ajustar a visualização
    if (mapRef.current) {
      const edgePadding = { top: 50, right: 50, bottom: 50, left: 50 };
      mapRef.current.fitToCoordinates([origin, destination], { edgePadding });
    }
  };
  

  // Lidar com busca de localização
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    // Em uma implementação real, usaria uma API de geocodificação
    // Simular busca para esta demonstração
    Alert.alert("Busca", `Buscando por: ${searchInput}`);
    setShowSearchModal(false);
    
    // Simulando uma resposta de geocodificação
    const randomOffset = (Math.random() - 0.5) * 0.01;
    setRegion({
      ...region,
      latitude: region.latitude + randomOffset,
      longitude: region.longitude + randomOffset
    });
  };

  // Limpar rota atual
  const clearRoute = () => {
    setSafetyRoute([]);
    setRouteSegments([]);
    setRouteInfo(null);
    setShowRouteInfo(false);
    setSelectedAttraction(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        customMapStyle={customMapStyle}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          checkNearbyAlerts(newRegion);
        }}
        onLongPress={(e) => {
          setRegion({
            ...region,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          });
          setShowAddAlertModal(true);
        }}
      >
        {/* Marcador de localização do usuário */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Você está aqui"
            pinColor="#A97ADB"
          />
        )}

        {/* Marcadores de pontos turísticos */}
        {showAttractions && touristAttractions.map((attraction, index) => (
          <Marker
            key={`attraction-${index}`}
            coordinate={attraction.position}
            title={attraction.title}
            pinColor="#A97ADB"
          >
            <Callout onPress={() => {
              setSelectedAttraction(attraction);
              calculateRouteTo(attraction.position);
            }}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{attraction.title}</Text>
                <Text>{attraction.description}</Text>
                <Text style={styles.calloutButton}>Como chegar com segurança</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Marcadores de alertas de segurança */}
        {showSafetyAlerts && safetyAlerts.map((alert, index) => (
          <Marker
            key={`alert-${index}`}
            coordinate={alert.location}
            title={alert.message}
          >
            <View style={[styles.alertMarker, { backgroundColor: getAlertColor(alert.type) }]} />
            <Callout onPress={() => setSelectedAlert(alert)}>
              <View style={styles.callout}>
                <Text style={[styles.calloutTitle, { color: getAlertColor(alert.type) }]}>
                  ⚠️ {alert.message}
                </Text>
                <Text>Última atualização: {alert.time}</Text>
                <Text style={styles.calloutButton}>Detalhes</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Segmentos da rota com cores baseadas em segurança */}
        {routeSegments.map((segment, index) => (
          <Polyline
            key={`segment-${index}`}
            coordinates={segment.coordinates}
            strokeColor={segment.color}
            strokeWidth={6}
          />
        ))}
      </MapView>

      {/* Controles de mapa */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowAttractions(!showAttractions)}
        >
          <Text style={styles.buttonText}>
            {showAttractions ? "Ocultar Pontos" : "Mostrar Pontos"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowSafetyAlerts(!showSafetyAlerts)}
        >
          <Text style={styles.buttonText}>
            {showSafetyAlerts ? "Ocultar Alertas" : "Mostrar Alertas"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowSearchModal(true)}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

       {/* Botão para limpar rota */}
       {safetyRoute.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearRoute}>
          <Text style={styles.buttonText}>Limpar Rota</Text>
        </TouchableOpacity>
      )}

      {/* Modal de Busca */}
      <Modal visible={showSearchModal} transparent animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buscar Local</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o destino..."
              value={searchInput}
              onChangeText={setSearchInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSearch}>
                <Text style={styles.modalButtonText}>Buscar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowSearchModal(false)}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal para Adicionar Alerta */}
      <Modal visible={showAddAlertModal} transparent animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Alerta de Segurança</Text>
            <TextInput
              style={styles.input}
              placeholder="Descreva o alerta..."
              value={newAlertMessage}
              onChangeText={setNewAlertMessage}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddAlert}>
                <Text style={styles.modalButtonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowAddAlertModal(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal de Informações da Rota Segura */}
      {routeInfo && (
    <View style={styles.routeInfoBox}>
      <Text style={styles.routeInfoText}>🚶‍♀️ Rota Segura</Text>
      <Text>🛤️ Distância: {routeInfo.distance}</Text>
      <Text>⏳ Duração: {routeInfo.duration}</Text>
      <Text>🛡️ Segurança: {routeInfo.safety}</Text>
      <TouchableOpacity style={styles.closeRouteInfo} onPress={() => setRouteInfo(null)}>
        <Text style={styles.closeText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  )}

    </View>
  );
};

// 📌 Estilos do Componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#A97ADB",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  clearButton: {
    position: "absolute",
    bottom: 100,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#E63946",
    padding: 10,
    borderRadius: 8,
  },
  callout: {
    padding: 10,
    alignItems: "center",
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutButton: {
    color: "#A97ADB",
    marginTop: 5,
    fontWeight: "bold",
  },
  alertMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#A97ADB",
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  routeInfoBox: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  routeInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  closeRouteInfo: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#E63946",
    fontWeight: "bold",
  },
});

const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#F4F4F9" }] // Fundo claro e limpo
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#2A2A2A" }] // Textos escuros para contraste
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#F4F4F9" }] // Fundo do texto suavizado
  },
  // 🌎 Parques e Praças Culturais Destacadas
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#CFD2B2" }] // Verde suave para parques
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#CFD2B2" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2A2A2A" }]
  },
  // 🎭 Pontos Culturais e Históricos
  {
    featureType: "poi.attraction",
    elementType: "geometry",
    stylers: [{ color: "#E2D6F2" }] // Destaque para locais culturais
  },
  {
    featureType: "poi.attraction",
    elementType: "labels.text.fill",
    stylers: [{ color: "#553D6E" }] // Texto roxo escuro para destaque
  },
  // 🛣️ Estradas
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#553D6E" }] // Ruas em tom roxo suave
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#553D6E" }] // Bordas iguais para todas as vias
  },
  // 🚉 Transporte Público
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#A97ADB" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#553D6E" }]
  },
  // 💧 Água
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#C7D7FF" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2A2A2A" }]
  }
];

export default MapComponent;