import React, { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Alert, Text, Modal, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region, Marker, Callout } from 'react-native-maps';
import { markers } from '../assets/markers'
import {alerts} from '../assets/alerts'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const INITIAL_REGION = {
  latitude: -8.060511,
  longitude: -34.870314,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

type AlertType = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  type: string;
  photo: any; // Pode ser 'require' ou um caminho para a imagem
};

interface MapScreenProps {
  // Você pode adicionar props específicas aqui conforme necessário
}

const MapScreen: React.FC<MapScreenProps> = () => {
  const mapRef = useRef<MapView>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  const onRegionChange = (region: Region) => {
    console.log(region)
  }

  const onMarkerSelected = (marker: any) => {
    Alert.alert(marker.name)
  }

  // const onAlertSelected = (alert: any) => {
  //   Alert.alert(
  //     alert.title,
  //     `Descrição: ${alert.description}\nTipo: ${alert.type}`,
  //     [
  //       { text: 'OK' }
  //     ]
  //   );
  // };

  const onAlertSelected = (alert: any) => {
    setSelectedAlert(alert);  // Armazenar o alerta selecionado
    setIsModalVisible(true);  // Exibir o modal
  };

  const closeModal = () => {
    setIsModalVisible(false);  // Fechar o modal
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsTraffic={false}
        moveOnMarkerPress={false}
        onRegionChangeComplete={onRegionChange}
        ref={mapRef}
      >
        {/* {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            onPress={() => onMarkerSelected(marker)}
            anchor={{ x: 0.5, y: 1 }} // Posicionando imagem
          >
            <Image
              source={require('../assets/images/alert.png')}
              style={{ width: 40, height: 40 }} // Redimensionando a imagem
            />
          </Marker>
        ))} */}
        {alerts.map((alert, index) => (
          <Marker
            key={index}
            coordinate={alert}
            onPress={() => onAlertSelected(alert)}
            anchor={{ x: 0.5, y: 1 }} // Posicionando imagem
          >
            <Image
              source={alert.photo}
              style={{ width: 30, height: 30 }} // Redimensionando a imagem
            />
          </Marker>
        ))}
      </MapView>

      {/* Modal para exibir o alerta detalhado */}
      {selectedAlert && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={selectedAlert.photo} style={styles.alertImage} />
              <Text style={styles.alertTitle}>{selectedAlert.title}</Text>
              <Text style={styles.alertDescription}>{selectedAlert.description}</Text>
              <Text style={styles.alertType}>{`Tipo: ${selectedAlert.type}`}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  alertDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  alertType: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MapScreen;