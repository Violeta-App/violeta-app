import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { ReportCard } from './ReportCard';
import { LocationCard } from './LocationCard';
import { SearchBarLocal } from './SearchBarLocal';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/app/_layout';

export function NearbyContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);

  const places = [
    { title: "Hamburgueria do seu Zé", rating: "4.4", distance: "0.7 km", category: "Gastronomia" },
    { title: "Feirinha na Laje", rating: "4.4", distance: "0.7 km", category: "Eventos" },
    { title: "Biblioteca Municipal", rating: "4.8", distance: "1.2 km", category: "Cultura" },
  ];

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
    fetchOccurrences();
  }, [currentCoords]);

  const fetchOccurrences = async () => {
    try {
      const response = await fetch('https://violeta-be.onrender.com/occurrences');
      const data = await response.json();
      const sorted = data
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
      setOccurrences(sorted);
    } catch (err) {
      console.error('Erro ao carregar relatos:', err);
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

  const searchLower = searchQuery.toLowerCase();

  const filteredOccurrences = occurrences.filter((item) =>
    item.address.toLowerCase().includes(searchLower) ||
    item.main_reason.toLowerCase().includes(searchLower)
  );

  const filteredPlaces = places.filter(place =>
    place.title.toLowerCase().includes(searchLower) ||
    place.category.toLowerCase().includes(searchLower)
  );

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
          ) : (
            filteredOccurrences.map((item) => (
              <ReportCard
                key={item.occurrence_id}
                location={item.address}
                timestamp={`${formatDate(item.date)} ${item.time}`}
                category={item.main_reason}
                description={item.occurrence_description}
              />
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.header}>
          <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.black} />
          <Text style={styles.title}>Lugares próximos à você</Text>
        </View>
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ gap: 1, maxHeight: 250 }}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place, index) => (
              <LocationCard
                key={index}
                title={place.title}
                rating={place.rating}
                distance={place.distance}
                category={place.category}
              />
            ))
          ) : (
            <Text style={styles.noResults}>Nenhum local encontrado</Text>
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
