import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { ReportCard } from './ReportCard';
import { LocationCard } from './LocationCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/app/_layout';

export function NearbyContent() {
  const [currentCoords, setCurrentCoords] = useState(null);
  const [occurrences, setOccurrences] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      setCurrentCoords(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (!currentCoords) return;
    fetchData();
  }, [currentCoords]);

  const fetchData = async () => {
    try {
      const [occurrencesRes, safePlacesRes] = await Promise.all([
        fetch('https://violeta-be.onrender.com/occurrences'),
        fetch('https://violeta-be.onrender.com/locais_seguros'),
      ]);

      const occurrencesData = await occurrencesRes.json();
      const safePlacesData = await safePlacesRes.json();

      const enrichedOccurrences = occurrencesData
        .map((item) => ({
          ...item,
          distance: getDistance(
            currentCoords.latitude,
            currentCoords.longitude,
            item.latitude,
            item.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      const enrichedSafePlaces = safePlacesData
        .map((place) => ({
          ...place,
          distance: getDistance(
            currentCoords.latitude,
            currentCoords.longitude,
            place.latitude,
            place.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      setOccurrences(enrichedOccurrences);
      setSafePlaces(enrichedSafePlaces);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getOpeningHour = (place) => {
    const days = [
      'sunday', 'monday', 'tuesday', 'wednesday',
      'thursday', 'friday', 'saturday'
    ];
    const today = new Date().getDay(); // 0 = domingo, 1 = segunda, etc.
    const horariosHoje = place?.[days[today]];

    if (!horariosHoje || typeof horariosHoje !== 'string') return null;

    // Corrigir todos os tipos de travessão para hífen simples
    const normalized = horariosHoje.replace(/[–—]/g, '-');
    const parts = normalized.split('-');
    if (parts.length !== 2) return null;

    const [abertura, fechamento] = parts.map((p) => p.trim());
    return { abertura, fechamento };
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionReports}>
        <View style={styles.header}>
          <FontAwesome5 name="exclamation-triangle" size={16} color={theme.colors.black} />
          <Text style={styles.title}>Relatos próximos à você</Text>
        </View>
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ gap: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.lightPurple} />
          ) : occurrences.length > 0 ? (
            occurrences.map((item) => (
              <ReportCard
                key={item.occurrence_id}
                location={item.address}
                timestamp={`${formatDate(item.date)} ${item.time}`}
                category={item.main_reason}
                description={item.occurrence_description}
              />
            ))
          ) : (
            <Text style={styles.noResults}>Nenhum relato encontrado</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.header}>
          <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.black} />
          <Text style={styles.title}>Locais seguros próximos à você</Text>
        </View>
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ gap: 1 }}>
          {safePlaces.length > 0 ? (
            safePlaces.map((place) => {
              const horarios = getOpeningHour(place);
              return (
                <LocationCard
                  key={place.id}
                  title={place.name}
                  rating={place.rating?.toFixed(1) || '4.0'}
                  distance={`${place.distance.toFixed(1)} km`}
                  category={place.tipo}
                  horario_abertura={horarios?.abertura}
                  horario_fechamento={horarios?.fechamento}
                  address={place.address}
                  latitude={place.latitude}
                  longitude={place.longitude}
                />
              );
            })
          ) : (
            <Text style={styles.noResults}>Nenhum local seguro encontrado</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  section: {
    backgroundColor: theme.colors.lightPurple,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  sectionReports: {
    backgroundColor: theme.colors.beige,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
    marginLeft: 6,
  },
  noResults: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
  scrollArea: {
    maxHeight: 350,
  },
});
