import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';
import { ReportComment } from '@/components/ReportComment';
import { PlaceCard } from '@/components/PlaceCard';

export default function LocationDetailsScreen() {
  const { title } = useLocalSearchParams();
  const navigation = useNavigation();

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
      <ScrollView style={styles.container}>
        {/* Chamando o PlaceCard aqui dentro */}
        <PlaceCard
          title="Projeto Cafe Bar"
          address="Rua do Luar, 10"
          rating={4.4}
          category="Gastronomia"
          imageUrl="https://static.wikia.nocookie.net/club-penguin-land20/images/3/34/800px-Caf%C3%A92012.PNG/revision/latest?cb=20180726163757&path-prefix=pt-br"
        />

        {/* Sessão de Relatos */}
        <View style={styles.reportsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.textHeader}>5 RELATOS</Text>
          </View>
          <ReportComment user="Lívia Bion" categories={["Pouco Policiamento", "Má Iluminação"]} timestamp="Jan 10, 2022 12:21 PM" />
          <ReportComment user="Anônimo" categories={["Pouco Policiamento"]} timestamp="Jan 10, 2022 12:21 PM" />
          <ReportComment user="Lívia Bion" categories={["Pouco Policiamento"]} timestamp="Jan 10, 2022 12:21 PM" />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: 16,
  },
  reportsSection: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '110%',
    marginLeft: -20,
    backgroundColor: theme.colors.primaryPurple,
    marginBottom: 12,
    paddingTop: 4,
  },
  textHeader: {
    fontSize: 16,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: 8,
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
});
