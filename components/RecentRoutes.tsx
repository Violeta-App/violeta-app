// components/RecentRoutes.tsx
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';

export function RecentRoutes() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="clock" size={16} color={theme.colors.black} />
        <Text style={styles.title}>Rotas recentes</Text>
      </View>
      <View style={styles.routeItem}>
        <FontAwesome5 name="route" size={14} color={theme.colors.black} />
        <Text style={styles.routeText}>Centro de Informática</Text>
        <FontAwesome5 name="walking" size={16} color={theme.colors.black} />
      </View>
      <View style={styles.routeItem}>
        <FontAwesome5 name="route" size={14} color={theme.colors.black} />
        <Text style={styles.routeText}>Academia SmartFit</Text>
        <FontAwesome5 name="walking" size={16} color={theme.colors.black} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.beige,
    borderRadius: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
  },
});