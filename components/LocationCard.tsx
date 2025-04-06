import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../app/_layout';

interface LocationCardProps {
  id: string;
  title: string;
  rating?: number | string;
  distance: string;
  category: string;
  horario_abertura?: string;
  horario_fechamento?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export function LocationCard({
  id,
  title,
  rating,
  distance,
  category,
  horario_abertura,
  horario_fechamento,
  address = '',
  latitude = 0,
  longitude = 0,
}: LocationCardProps) {
  const router = useRouter();

  const isOpen = (abertura: string, fechamento: string) => {
    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;

    const [openHour, openMin] = abertura.split(':').map(Number);
    const [closeHour, closeMin] = fechamento.split(':').map(Number);

    const openTime = openHour + openMin / 60;
    const closeTime = closeHour + closeMin / 60;

    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    }

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const openStatus =
    horario_abertura && horario_fechamento
      ? isOpen(horario_abertura, horario_fechamento)
      : null;

  const formattedRating =
    typeof rating === 'number'
      ? rating.toFixed(1)
      : typeof rating === 'string' && !isNaN(Number(rating))
      ? Number(rating).toFixed(1)
      : '4.0';

  const statusLabel =
    !horario_abertura || !horario_fechamento
      ? 'Horário não informado'
      : openStatus
      ? `Aberto agora · Fecha às ${horario_fechamento}`
      : `Fechado agora · Abre às ${horario_abertura}`;

  const statusColor = !horario_abertura || !horario_fechamento
    ? theme.colors.darkGray
    : openStatus
    ? 'green'
    : 'red';

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: 'location-details',
          params: {
            id, // agora passamos o id para buscar dados completos
            name: title,
            rating: formattedRating,
            category,
            address,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          },
        })
      }
      style={styles.card}
    >
      <Text style={styles.title}>{title}</Text>

      <View style={[styles.statusTag, { backgroundColor: statusColor }]}>
        <Text style={styles.statusTagText}>{statusLabel}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.rating}>★ {formattedRating}</Text>
        <Text style={styles.distance}> · {distance}</Text>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.category}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.beige,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  rating: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
  },
  distance: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
  },
  categoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.colors.primaryPurple,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusTagText: {
    fontSize: 12,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
  },
});
