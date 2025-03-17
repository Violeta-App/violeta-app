import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewReportScreen() {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const categories = ["Assédio", "Furto/Roubo", "Má Iluminação", "Pouca movimentação", "Pouco Policiamento"];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: theme.colors.white },
          headerTitleStyle: { color: theme.colors.black, fontFamily: theme.fonts.ibmPlexSans },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={20} color={theme.colors.primaryPurple} />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Adicionar novo relato</Text>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategories.includes(cat) && styles.categoryButtonActive]}
              onPress={() => toggleCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategories.includes(cat) && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.inputMultiline}
          placeholder="Descreva o ocorrido da forma que se sentir confortável."
          placeholderTextColor={theme.colors.darkGray}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Av. João Maria"
          placeholderTextColor={theme.colors.darkGray}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Data e Hora</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimePicker}>
          <Text>{date.toLocaleDateString()}  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Relatar anonimamente</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: theme.colors.beige, true: theme.colors.primaryPurple }}
            thumbColor={theme.colors.white}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Enviar Relato</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  backText: {
    fontSize: 16,
    color: theme.colors.primaryPurple,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.primaryPurple,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.black,
    marginBottom: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: theme.colors.beige,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primaryPurple,
  },
  categoryText: {
    color: theme.colors.black,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  input: {
    backgroundColor: theme.colors.beige,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputMultiline: {
    backgroundColor: theme.colors.beige,
    padding: 10,
    borderRadius: 8,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  dateTimePicker: {
    backgroundColor: theme.colors.beige,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.beige,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelText: {
    color: theme.colors.black,
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primaryPurple,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});
