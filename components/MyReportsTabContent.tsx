import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ReportCard } from './ReportCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { theme } from '@/app/_layout';

const mockReports = [
  {
    occurrence_id: '1',
    address: 'Rua das Flores, 123',
    date: '2025-04-05',
    time: '18:30',
    main_reason: 'Assédio',
    occurrence_description: 'Homem assediou mulher na parada de ônibus.',
  },
  {
    occurrence_id: '2',
    address: 'Avenida Central, 45',
    date: '2025-04-04',
    time: '20:10',
    main_reason: 'Má Iluminação',
    occurrence_description: 'Rua completamente escura, perigo para pedestres.',
  },
];

export function MyReportsTabContent() {
  const [userReports] = useState(mockReports);
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('new-report')}
        >
          <FontAwesome5 name="plus" size={15} color={theme.colors.darkerGray} />
        </TouchableOpacity>
      </View>

      {userReports.length > 0 ? (
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          {userReports.map((item) => (
            <ReportCard
              key={item.occurrence_id}
              location={item.address}
              timestamp={`${item.date} ${item.time}`}
              category={item.main_reason}
              description={item.occurrence_description}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.sectionTitle}>Nenhum relatório pessoal a exibir.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: theme.colors.lightPurple,
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
    marginTop: 20,
  },
});
