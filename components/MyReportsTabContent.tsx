import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { ReportCard } from './ReportCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { theme } from '@/app/_layout';

export function MyReportsTabContent() {
  const [userReports, setUserReports] = useState([]);
  const navigation = useNavigation();

  const userId = "14f936fb-5c27-4e29-bcba-65fedc69062f"; // ID certo conforme imagem

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('https://violeta-be.onrender.com/occurrences');
        const data = await res.json();

        // Verifique o campo user_id corretamente
        const filtered = data.filter((item: any) => item.user_id === userId);
        setUserReports(filtered);
      } catch (error) {
        console.error("Erro ao buscar relatos:", error);
      }
    };

    fetchReports();
  }, []);

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
