import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
  const [loading, setLoading] = useState(false);

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
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        const address = geocode[0];
        const formatted = `${address.street}, ${address.name || address.subregion}`;
        setCurrentAddress(formatted);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) return;
    fetchOccurrences();
  }, [searchQuery]);

  const fetchOccurrences = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://violeta-be.onrender.com/occurrences');
      const data = await response.json();
      setAllOccurrences(data);
    } catch (err) {
      console.error('Erro ao buscar relatos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const filteredOccurrences = allOccurrences.filter((item) =>
    item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.main_reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaces = places.filter((place) =>
    place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          {currentAddress ? currentAddress : 'Carregando localização...'}
        </Text>
        <FontAwesome5 name="map-marker-alt" size={14} color="#674188" style={{ marginLeft: 4 }} />
      </View>

      <SearchBarLocal onSearch={setSearchQuery} />

      {searchQuery.trim().length > 0 ? (
        loading ? (
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
              <Text style={styles.noResults}>Nenhum local encontrado.</Text>
            )}
          </>
        )
      ) : (
        <NearbyContent />
      )}
    </View>
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
  },
  locationText: {
    color: '#674188',
    fontSize: 12,
    width: '95%',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: theme.fonts.ibmPlexSans,
    marginVertical: 10,
    color: theme.colors.black,
  },
  noResults: {
    fontSize: 14,
    color: theme.colors.darkerGray,
    fontFamily: theme.fonts.ibmPlexSans,
    textAlign: 'center',
    marginTop: 10,
  },
});
