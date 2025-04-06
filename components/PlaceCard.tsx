import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

interface OpeningHours {
  sunday?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
}

interface PlaceCardProps {
  title: string;
  address: string;
  rating: number;
  category: string;
  openingHours?: OpeningHours;
}

const diaSemanaPt: Record<string, string> = {
  sunday: 'Domingo',
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
};

function formatOpeningHours(input?: string): string {

  if (!input || input.trim() === '') return 'Fechado';

  const normalized = input.trim().replace(/[\u2013\u2014–]/g, '-');
  const parts = normalized.split('-').map((part) => part.trim());

  if (parts.length === 2 && parts[0] && parts[1]) {
    const result = `Abre às ${parts[0]} · Fecha às ${parts[1]}`;
    return result;
  }

  return 'Fechado';
}

export function PlaceCard({
  title,
  address,
  rating,
  category,
  openingHours,
}: PlaceCardProps) {
  const dayIndex = new Date().getDay();
  const diasSemana = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = diasSemana[dayIndex];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.addressContainer}>
        <FontAwesome5 name="map-marker-alt" size={14} color={theme.colors.primaryPurple} />
        <Text style={styles.address}>{address}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.leftInfo}>
          <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
      </View>

      {openingHours && (
        <View style={styles.hoursContainer}>
          <Text style={styles.sectionTitle}>Horários de funcionamento</Text>
          {Object.entries(openingHours).map(([day, hours]) => (
            <View
              key={day}
              style={[
                styles.hourItem,
                today === day && styles.highlightedDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  today === day && styles.highlightedText,
                ]}
              >
                {diaSemanaPt[day]}:
              </Text>
              <Text
                style={[
                  styles.hourText,
                  today === day && styles.highlightedText,
                ]}
              >
                {formatOpeningHours(hours)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.softPurple,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.darkerGray,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.black,
    fontFamily: theme.fonts.ibmPlexSans,
  },
  categoryTag: {
    backgroundColor: theme.colors.primaryPurple,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  hoursContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightPurple,
    paddingTop: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: theme.fonts.ibmPlexSans,
    marginBottom: 6,
    color: theme.colors.black,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  dayText: {
    fontSize: 13,
    color: theme.colors.black,
    fontFamily: theme.fonts.ibmPlexSans,
  },
  hourText: {
    fontSize: 13,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
  },
  highlightedDay: {
    backgroundColor: '#f0eaff',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  highlightedText: {
    fontWeight: 'bold',
    color: theme.colors.primaryPurple,
  },
});
