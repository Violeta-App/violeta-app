import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LocationCard } from './LocationCard';
import { theme } from '../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';

export function NearbyPlaces() {
    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.black} />
            <Text style={styles.title}>Lugares próximos à você</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContainer}>
            <LocationCard title="Hamburgueria do seu Zé" rating="4.4" distance="0.7 km" category="Gastronomia" />
            <LocationCard title="Feirinha na Laje" rating="4.4" distance="0.7 km" category="Eventos" />
            <LocationCard title="Biblioteca Municipal" rating="4.4" distance="0.7 km" category="Cultura" />
        </ScrollView>
        </View>
    );
}
  
const styles = StyleSheet.create({
container: {
    backgroundColor: theme.colors.primaryPurple,
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
    fontWeight: 600,
    color: theme.colors.black,
    marginLeft: 6,
},
scrollContainer: {
    gap: 4,
},
});