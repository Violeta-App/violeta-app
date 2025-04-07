import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

type Props = {
  routes: any[];
  onSelectRoute: (route: any) => void;
  calculateRouteSafety: (route: any) => number;
  formatDuration: (durationString: string) => string;
  destinationText: string;
};

const AlternativeRoutesButtons: React.FC<Props> = ({
  routes,
  onSelectRoute,
  calculateRouteSafety,
  formatDuration,
  destinationText
}) => {
  const sortedRoutes = routes
  .slice()
  .sort((a, b) => calculateRouteSafety(b) - calculateRouteSafety(a));

  return (
    <View style={styles.bottomSheet}>
      <Text style={styles.headerText}>Rotas para {destinationText} </Text>
      <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {sortedRoutes.map((route, index) => {
        const safetyPercent = calculateRouteSafety(route);
        const durationFormatted = route.duration
          ? formatDuration(route.duration)
          : 'Tempo não disponível';

        return (
          <View key={index} style={styles.routeCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTitle}> Opcão {index + 1} </Text>
              <View style={styles.infoRow}>
                <Entypo name="warning" size={16} color="black" style={styles.icon} />
                <Text style={styles.infoText}>
                  {safetyPercent.toFixed(0)}% de segurança na rota
                </Text>
              </View>
            </View>

            <View style={styles.rightContent}>
              <View style={styles.timeRow}>
                <FontAwesome5 name="clock" size={14} color="black" />
                <Text style={styles.timeText}> {durationFormatted}</Text>
              </View>
              <TouchableOpacity
                style={styles.goButton}
                onPress={() => onSelectRoute(route)}
              >
                <Text style={styles.goButtonText}>➚ Ir</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
    </View>
  );
};

export default AlternativeRoutesButtons;

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '55%', 
    backgroundColor: '#E2D6F2',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2A2A2A',
    fontSize: 18,
    marginBottom: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  routeCard: {
    backgroundColor: '#CFD2B2',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
  },
  rightContent: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '400',
  },
  goButton: {
    backgroundColor: '#B48EFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  goButtonText: {
    color: '#F4F4F9',
    fontWeight: 'bold',
  },
});
