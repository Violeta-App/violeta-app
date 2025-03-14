import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '@/components/Header';
import { RecentRoutes } from '@/components/RecentRoutes';
import { ActionButtons } from '@/components/ActionButtons';
import { CommunitySection } from '@/components/CommunitySection';
import { SearchBar } from '@/components/SearchBar';
import { theme } from '../_layout';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Header />
        <SearchBar />
        <RecentRoutes />
        <ActionButtons />
        <CommunitySection />
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
    paddingTop: 40,
  },
});
