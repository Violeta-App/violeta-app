// components/AlertModal.tsx
import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AlertModal = ({ visible, alert, onClose }: { visible: boolean, alert: any, onClose: () => void }) => {
  if (!alert) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={require("../assets/images/alert.png")} style={styles.alertImage} />
          <Text style={styles.alertTitle}>{alert.titulo}</Text>
          <Text style={styles.alertDescription}>{alert.descricao}</Text>
          <Text style={styles.alertType}>{`Tipo: ${alert.tipo}`}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
        width: '75%',
        backgroundColor: '#E2D6F2',
        borderRadius: 10,
        padding: 20,
        paddingVertical: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      alertImage: {
        width: 100,
        height: 100,
        marginBottom: 15,
        resizeMode: 'contain',
    
      },
      alertTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2A2A2A',
        marginBottom: 10,
      },
      alertDescription: {
        fontSize: 16,
        color: '#2A2A2A',
        textAlign: 'center',
        marginBottom: 15,
      },
      alertType: {
        fontSize: 14,
        color: '#2A2A2A',
        marginBottom: 15,
      },
      closeButton: {
        backgroundColor: '#553D6E',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius:32,
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 16,
      }
});

export default AlertModal;
