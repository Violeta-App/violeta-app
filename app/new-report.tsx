import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { theme } from '../app/_layout';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import MapPicker from '@/components/MapPicker';

const causeWeights = {
  "Homicídio/Tentativa": 100, "Estupro": 90, "Sequestro/Cárcere Privado": 80, "Assédio": 70,
  "Roubo/Tentativa": 60, "Briga": 50, "Operação Policial": 40, "Disparo Acidental": 30,
  "Arrastão": 20, "Má Iluminação": 15, "Pouca movimentação": 15, "Pouco Policiamento": 15,
  "Não Identificado": 10,
};

const victimSituationWeights = {
  "dead": 100, "wounded": 50, "unharmed": 10
};

export default function NewReportScreen() {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [autoAddress, setAutoAddress] = useState('');

  const userId = "14f936fb-5c27-4e29-bcba-65fedc69062f";

  const categories = Object.keys(causeWeights);

  useEffect(() => {
    if (!selectedCoords) return;
    (async () => {
      const address = await Location.reverseGeocodeAsync(selectedCoords);
      if (address.length > 0) {
        const a = address[0];
        const formatted = `${a.street}, ${a.name || a.subregion}`;
        setAutoAddress(formatted);
        setGeoData({
          latitude: selectedCoords.latitude,
          longitude: selectedCoords.longitude,
          city: a.city,
          region: a.region,
          state: a.region,
          address: formatted,
        });
      }
    })();
  }, [selectedCoords]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    try {
      if (!geoData || selectedCategories.length === 0 || !description) {
        Alert.alert("Campos obrigatórios", "Preencha todos os campos e selecione ao menos uma categoria.");
        return;
      }

      const category = selectedCategories[0];
      const main_reason = category;
      const victim_situation = "unharmed";
      const occurrence_score = (causeWeights[main_reason] || 10) + (victimSituationWeights[victim_situation] || 0);

      const payload = {
        user_id: userId,
        occurrence_description: description,
        address: geoData.address || autoAddress || 'Endereço não identificado',
        region: geoData.region || '',
        state: geoData.state || geoData.region || '',
        city: geoData.city || '',
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().split(' ')[0].slice(0, 5),
        main_reason,
        victim_situation,
        anonymous: isAnonymous,
        victim_name: isAnonymous ? '' : 'Nome não informado',
        occurrence_score
      };

      const res = await fetch('https://violeta-be.onrender.com/occurrences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([payload])
      });

      const responseText = await res.text();
      console.log('[ENVIO] status:', res.status);
      console.log('[ENVIO] resposta:', responseText);

      if (res.ok) {
        Alert.alert("Relato enviado", "Seu relato foi registrado com sucesso.");
        navigation.goBack();
      } else {
        Alert.alert("Erro", `Erro ao enviar relato. Código: ${res.status}`);
      }

    } catch (error) {
      console.error("Erro ao enviar relato:", error);
      Alert.alert("Erro", "Não foi possível enviar o relato.");
    }
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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

        <Text style={styles.label}>Localização no mapa</Text>
        <MapPicker onSelectLocation={setSelectedCoords} />
        {autoAddress && <Text style={{ fontSize: 12, marginBottom: 12 }}>{autoAddress}</Text>}

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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Enviar Relato</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
    paddingBottom: 60,
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
