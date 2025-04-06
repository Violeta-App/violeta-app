import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { ReportCard } from './ReportCard';
import { LocationCard } from './LocationCard';
import { SearchBarLocal } from './SearchBarLocal';
import { theme } from '@/app/_layout';
import { NearbyContent } from './NearbyContent';

export function CommunityTabContent() {
  const [currentAddress, setCurrentAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allOccurrences, setAllOccurrences] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      setCurrentCoords(location.coords);

      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        const address = geocode[0];
        const formatted = `${address.street}, ${address.name || address.subregion}`;
        setCurrentAddress(formatted);
      }
    })();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') return;

    setLoading(true);
    try {
      const [occRes, placesRes] = await Promise.all([
        fetch('https://violeta-be.onrender.com/occurrences'),
        fetch('https://violeta-be.onrender.com/locais_seguros'),
      ]);

      const occurrences = await occRes.json();
      const places = await placesRes.json();

      setAllOccurrences(occurrences);
      setAllPlaces(places);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const searchLower = searchQuery.toLowerCase();

  const filteredOccurrences = allOccurrences.filter((item) =>
    item.address.toLowerCase().includes(searchLower) ||
    item.main_reason.toLowerCase().includes(searchLower)
  );

  const filteredPlaces = allPlaces
    .map((place) => ({
      ...place,
      distance: currentCoords
        ? getDistance(currentCoords.latitude, currentCoords.longitude, place.latitude, place.longitude)
        : null,
    }))
    .filter((place) =>
      place.name.toLowerCase().includes(searchLower) ||
      place.tipo.toLowerCase().includes(searchLower)
    );

  const dayKeys = [
    'sunday', 'monday', 'tuesday', 'wednesday',
    'thursday', 'friday', 'saturday'
  ];
  const todayKey = dayKeys[new Date().getDay()];

  return (
    <ScrollView style={{ paddingBottom: 40 }}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          {currentAddress ? currentAddress : 'Carregando localização...'}
        </Text>
        <FontAwesome5 name="map-marker-alt" size={14} color="#674188" style={{ marginLeft: 4 }} />
      </View>

      <SearchBarLocal onSearch={handleSearch} />

      {searchQuery.trim().length === 0 ? (
        <NearbyContent />
      ) : loading ? (
        <ActivityIndicator size="large" color={theme.colors.lightPurple} style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.sectionHeader}>Relatos</Text>
          {filteredOccurrences.length > 0 ? (
            filteredOccurrences.map((item) => (
              <ReportCard
                key={item.occurrence_id}
                location={item.address}
                timestamp={`${formatDate(item.date)} ${item.time}`}
                category={item.main_reason}
                description={item.occurrence_description}
              />
            ))
          ) : (
            <Text style={styles.noResults}>Nenhum relato encontrado.</Text>
          )}

          <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Lugares</Text>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place, index) => {
              const horarioHoje = place[todayKey] || '';
              const [aberturaHoje, fechamentoHoje] = horarioHoje
                .replace(/[\u2013\u2014–]/g, '-')
                .split('-')
                .map((h) => h?.trim());

              return (
                <LocationCard
                  key={place.id || index}
                  id={place.id}
                  title={place.name}
                  rating={place.rating?.toFixed(1) || '4.0'}
                  distance={place.distance ? `${place.distance.toFixed(1)} km` : '—'}
                  category={place.tipo}
                  horario_abertura={aberturaHoje}
                  horario_fechamento={fechamentoHoje}
                  address={place.address}
                  latitude={place.latitude}
                  longitude={place.longitude}
                />
              );
            })
          ) : (
            <Text style={styles.noResults}>Nenhum local encontrado.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1edf9',
    padding: 4,
    borderRadius: 4,
    marginBottom: 16,
    marginTop: 10,
  },
  locationText: {
    color: '#674188',
    fontSize: 12,
    width: '95%'
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: theme.fonts.ibmPlexSans,
    marginVertical: 10,
    color: theme.colors.black,
    marginLeft: 16,
  },
  noResults: {
    fontSize: 14,
    color: theme.colors.darkerGray,
    fontFamily: theme.fonts.ibmPlexSans,
    textAlign: 'center',
    marginTop: 10,
  },
});
