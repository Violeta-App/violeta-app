import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { FilterTabs } from '@/components/FilterTabs';
import { theme } from '../_layout';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { CommunityTabContent } from '@/components/CommunityTabContent';
import { ReportCard } from '@/components/ReportCard';
import { getUserId } from '@/utils/userId';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('community');
  const [userReports, setUserReports] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (activeTab === 'personal') {
      (async () => {
        const userId = await getUserId();
        const res = await fetch(`https://violeta-be.onrender.com/occurrences?user_id=${userId}`);
        const data = await res.json();
        setUserReports(data);
      })();
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FilterTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === 'community' ? (
          <CommunityTabContent />
        ) : (
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('new-report')}>
                <FontAwesome5 name="plus" size={15} color={theme.colors.darkerGray} />
              </TouchableOpacity>
            </View>
            {userReports.length > 0 ? (
              userReports.map((item) => (
                <ReportCard
                  key={item.occurrence_id}
                  location={item.address}
                  timestamp={`${item.date} ${item.time}`}
                  category={item.main_reason}
                  description={item.occurrence_description}
                />
              ))
            ) : (
              <Text style={styles.sectionTitle}>Nenhum relatório pessoal a exibir.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingBottom: 100,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
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
});
