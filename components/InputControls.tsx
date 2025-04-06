import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = {
  originText: string;
  destinationText: string;
  onChangeOrigin: (text: string) => void;
  onChangeDestination: (text: string) => void;
  onSearchPress: () => void;
};

const InputControls: React.FC<Props> = ({
  originText,
  destinationText,
  onChangeOrigin,
  onChangeDestination,
  onSearchPress
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeOrigin}
        placeholder="Origem"
        placeholderTextColor={'#2A2A2A'}
        value={originText}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeDestination}
        placeholder="Destino"
        placeholderTextColor={'#2A2A2A'}
        value={destinationText}
      />
      <TouchableOpacity style={styles.button} onPress={onSearchPress}>
        <FontAwesome5 name="search" size={16} color={'#2A2A2A'} style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Buscar Rota</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputControls;

const styles = StyleSheet.create({
  inputContainer: {
    zIndex: 10,
    margin: 20,
    marginTop: 32,
  },
  input: {
    height: 40,
    backgroundColor: '#CFD2B2',
    marginBottom: 10,
    paddingLeft: 20,
    borderRadius: 36,
    color: '#2A2A2A',
  },
  button: {
    backgroundColor: '#CFB7EA',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 36,
  },
  buttonText: {
    color: '#2A2A2A',
    textAlign: 'center',
    fontSize: 16,
  },
});
