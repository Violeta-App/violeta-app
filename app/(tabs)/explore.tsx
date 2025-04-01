import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import MapScreen from "../../components/MapView";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});