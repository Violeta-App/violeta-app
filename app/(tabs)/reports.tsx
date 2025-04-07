import { ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import { FilterTabs } from '@/components/FilterTabs';
import { theme } from '../_layout';
import { CommunityTabContent } from '@/components/CommunityTabContent';
import { MyReportsTabContent } from '@/components/MyReportsTabContent';
import { useFocusEffect } from 'expo-router';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('community');
    useFocusEffect(
      useCallback(() => {
        setActiveTab('community');
      }, [])
    );


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FilterTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === 'community' ? (
          <CommunityTabContent />
        ) : (
          <MyReportsTabContent />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 20,
  },
});
