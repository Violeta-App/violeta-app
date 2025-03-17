import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LocationCard } from './LocationCard';
import { theme } from '../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';

interface NearbyPlacesProps {
  searchQuery: string;
}

export function NearbyPlaces({ searchQuery }: NearbyPlacesProps) {
  const places = [
    { title: "Hamburgueria do seu Zé", rating: "4.4", distance: "0.7 km", category: "Gastronomia" },
    { title: "Feirinha na Laje", rating: "4.4", distance: "0.7 km", category: "Eventos" },
    { title: "Biblioteca Municipal", rating: "4.8", distance: "1.2 km", category: "Cultura" },
  ];

  const filteredPlaces = places.filter(place =>
    place.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.black} />
        <Text style={styles.title}>Lugares próximos à você</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContainer}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightPurple,
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    maxHeight: 700,
    height: 500,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: '600',
    color: theme.colors.black,
    marginLeft: 6,
  },
  scrollContainer: {
    gap: 4,
  },
  noResults: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
});
