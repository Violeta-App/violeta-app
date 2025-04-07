import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import MapScreen from "../../components/MapView";
import { useLocalSearchParams } from 'expo-router';

export default function ExploreScreen() {
  const { query } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapScreen query={typeof query === 'string' ? query : undefined} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
