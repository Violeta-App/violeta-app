import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';
import { ReportCard } from '@/components/ReportCard';
import { PlaceCard } from '@/components/PlaceCard';

export default function LocationDetailsScreen() {
  const navigation = useNavigation();
  const {
    id = '',
    name = '',
    address = '',
    rating = '0',
    category = '',
    latitude = '0',
    longitude = '0',
  } = useLocalSearchParams();

  const [safePlace, setSafePlace] = useState<any>(null);
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`https://violeta-be.onrender.com/locais_seguros/${id}`)
      .then((res) => res.json())
      .then((data) => setSafePlace(data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    fetch('https://violeta-be.onrender.com/occurrences')
      .then((res) => res.json())
      .then((data) => {
        const nearby = data.filter((occ) => {
          const dist = getDistance(
            parseFloat(latitude.toString()),
            parseFloat(longitude.toString()),
            occ.latitude,
            occ.longitude
          );
          return dist <= 1;
        });
        setOccurrences(nearby);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [latitude, longitude]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // 🔧 Prepara todos os dias da semana para o PlaceCard
  const openingHours = {
    sunday: safePlace?.sunday ?? '',
    monday: safePlace?.monday ?? '',
    tuesday: safePlace?.tuesday ?? '',
    wednesday: safePlace?.wednesday ?? '',
    thursday: safePlace?.thursday ?? '',
    friday: safePlace?.friday ?? '',
    saturday: safePlace?.saturday ?? '',
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: theme.colors.white },
          headerTitleStyle: {
            color: theme.colors.black,
            fontFamily: theme.fonts.ibmPlexSans,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <FontAwesome5
                name="arrow-left"
                size={20}
                color={theme.colors.primaryPurple}
              />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <PlaceCard
          title={safePlace?.name || name.toString()}
          address={safePlace?.address || address.toString()}
          rating={parseFloat(safePlace?.rating || rating.toString())}
          category={safePlace?.tipo || category.toString()}
          openingHours={openingHours}
        />

        <View style={styles.reportsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.textHeader}>
              {loading
                ? 'Carregando relatos...'
                : `${occurrences.length} Relato${occurrences.length !== 1 ? 's' : ''} próximo${occurrences.length !== 1 ? 's' : ''}`}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primaryPurple} />
          ) : occurrences.length > 0 ? (
            occurrences.map((relato) => (
              <ReportCard
                key={relato.occurrence_id}
                location={relato.address}
                timestamp={`${formatDate(relato.date)} ${relato.time}`}
                category={relato.main_reason}
                description={relato.occurrence_description}
              />
            ))
          ) : (
            <Text style={styles.noResults}>Nenhum relato encontrado próximo ao local.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: 16,
  },
  reportsSection: {
    marginTop: 12,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightPurple,
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 8,
  },
  textHeader: {
    fontSize: 16,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  noResults: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.darkerGray,
    textAlign: 'center',
    marginTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  backText: {
    fontSize: 16,
    color: theme.colors.primaryPurple,
    marginLeft: 8,
  },
});
