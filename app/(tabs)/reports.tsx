import { ScrollView, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { FilterTabs } from '@/components/FilterTabs';
import { theme } from '../_layout';
import { CommunityTabContent } from '@/components/CommunityTabContent';
import { MyReportsTabContent } from '@/components/MyReportsTabContent';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState('community');

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
    paddingBottom: 100,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 40,
  },
});
