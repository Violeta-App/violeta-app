import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { FilterTabs } from '@/components/FilterTabs';
import { SearchBarLocal } from '@/components/SearchBarLocal';
import { NearbyPlaces } from '@/components/NearbyPlaces';
import { ReportCard } from '@/components/ReportCard';
import { theme } from '../_layout';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('community');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <FilterTabs activeTab={activeTab} onChangeTab={setActiveTab} />
        {activeTab === 'community' ? (
          <View>
            <SearchBarLocal onSearch={setSearchQuery} />
            <NearbyPlaces searchQuery={searchQuery} />
          </View>
        ) : (
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('new-report')}>
                <FontAwesome5 name="plus" size={15} color={theme.colors.darkerGray} />
              </TouchableOpacity>
            </View>
            <ReportCard location="Av. João Maria" timestamp="Jan 30, 2022 12:21 PM" category="Pouco Policiamento" />
            <ReportCard 
              location="Av. João Maria" 
              timestamp="Jan 30, 2022 6:31 AM" 
              category="Pouco Policiamento" 
              description="Descrição do ocorrido Descrição do ocorrido Descrição do ocorrido Descrição do ocorrido" />
            <ReportCard location="Av. João Maria" timestamp="Jan 30, 2022 12:21 PM" category="Pouco Policiamento" />
            <ReportCard location="Av. João Maria" timestamp="Jan 18, 2022 12:21 PM" category="Pouco Policiamento" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 70,
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
