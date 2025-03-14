import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

export function SearchBar() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('explore')} style={styles.container}>
      <FontAwesome5 name="search" size={16} color={theme.colors.black} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar rota segura"
        placeholderTextColor={theme.colors.darkGray}
        editable={false} // Impede edição, tornando-a um botão funcional
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.beige,
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
  },
});