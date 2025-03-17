import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../app/_layout';

interface FilterTabsProps {
    activeTab: string;
    onChangeTab: (tab: string) => void;
  }
  
  export function FilterTabs({ activeTab, onChangeTab }: FilterTabsProps) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'community' && styles.activeTab]} 
          onPress={() => onChangeTab('community')}>
          <Text style={[styles.tabText, activeTab === 'community' && styles.activeTabText]}>Relatos da Comunidade</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'myReports' && styles.activeTab]} 
          onPress={() => onChangeTab('myReports')}>
          <Text style={[styles.tabText, activeTab === 'myReports' && styles.activeTabText]}>Meus Relatos</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.beige,
      borderRadius: 24,
      padding: 4,
      marginBottom: 12,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 24,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    activeTab: {
      backgroundColor: theme.colors.primaryPurple,
    },
    tabText: {
      fontSize: 12,
      fontFamily: theme.fonts.ibmPlexSans,
      color: theme.colors.black,
    },
    activeTabText: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
  });
  