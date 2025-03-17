import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../app/_layout';

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('@/assets/images/iconHeader.png')} style={styles.icon} />
      </View>
      <Text style={styles.greeting}>Olá, Lívia. Para onde vamos hoje?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { width: 24, height: 24, tintColor: theme.colors.black },
  greeting: { fontSize: 16, fontFamily: theme.fonts.ibmPlexSans, color: theme.colors.black, fontWeight: '500' },
});