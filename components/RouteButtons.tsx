// components/ActionButtons.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ActionButtonsProps {
    destinationText: string;
  onResetRoute: () => void;
  onCallPolice: () => void;
  onRouteSelected: () => void;
  setAddModalVisible: (visible: boolean) => void;
}

const RouteButtons: React.FC<ActionButtonsProps> = ({ destinationText, onResetRoute, onCallPolice, onRouteSelected, setAddModalVisible }) => {
  return (
    <View style={styles.actionButtonsContainer}>
     <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <FontAwesome5 name="map-marker-alt" size={18} color="#2A2A2A" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2A2A2A' }}>
            A caminho de {destinationText}
        </Text>
        </View>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onResetRoute}>
          <Text style={styles.secondaryButtonText}>Novo destino</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onRouteSelected}>
          <Text style={styles.secondaryButtonText}>Rotas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sosButton} onPress={onCallPolice}>
          <Text style={styles.sosButtonText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.alertButton} onPress={() => setAddModalVisible(true)}>
  <Text style={styles.alertButtonText}>Adicionar Alerta</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2D6F2',
    borderRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'flex-start',
    gap: 16,
    marginVertical: -16,
  },
  secondaryButton: {
    backgroundColor: '#CFD2B2',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#2A2A2A',
    fontWeight: 'bold',
  },
  alertButton: {
    backgroundColor: '#553D6E',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginTop: -48,
  },
  alertButtonText: {
    color: '#F4F4F9',
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  sosButton: {
    backgroundColor: '#CF5C36',
    paddingVertical: 52,
    paddingHorizontal: 25,
    borderRadius: 50,
    borderColor: '#553D6E',
    borderWidth: 6,
    marginLeft: 16,
  },
  sosButtonText: {
    color: '#F4F4F9',
    fontWeight: 'bold',
  },
});

export default RouteButtons;
