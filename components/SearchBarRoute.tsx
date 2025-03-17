import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useNavigation, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

export function SearchBarRoute() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const pathname = usePathname(); 

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    Keyboard.dismiss();
    if (pathname !== '/explore') {
      navigation.navigate('explore', { query: searchQuery });
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name="search" size={16} color={theme.colors.black} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar rota segura"
        placeholderTextColor={theme.colors.darkGray}
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.sendButton}>
        <FontAwesome5 name="arrow-right" size={16} color={theme.colors.darkerGray} />
      </TouchableOpacity>
    </View>
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
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
});
