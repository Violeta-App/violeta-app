import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';


type NewAlert = {
    title: string;
    description: string;
    type: string;
  };

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (alert: NewAlert) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  type: string;
  setType: (value: string) => void;
};

const AddAlertModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  type,
  setType,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
          <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.label}>Título:</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Assalto"
            style={styles.input}
          />

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Tentativa de assalto próximo ao local"
            style={styles.descriptionInput}
            multiline
          />

          <Text style={styles.label}>Tipo:</Text>
          <TextInput
            value={type}
            onChangeText={setType}
            placeholder="Ex: Perigo, Trânsito, Outro"
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#553D6E' }]}
              onPress={() => {
                onSubmit({ title, description, type });
                onClose(); 
              }}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
  </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddAlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#E2D6F2',
    borderRadius: 12,
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 2,
    borderColor: '#553D6E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 4,
  },
  descriptionInput: {
    borderWidth: 2,
    borderColor: '#553D6E',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 4,
    height: 120,            
    textAlignVertical: 'top', 
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});