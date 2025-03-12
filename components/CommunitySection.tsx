import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../app/_layout';


export function CommunitySection() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fique por dentro da comunidade Violeta</Text>
      <Image source={require('@/assets/images/community.png')} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
    backgroundColor: theme.colors.primaryPurple,
    borderRadius: 16,
    marginTop: 12,
  },
  text: {
    flex: 1,
    color: theme.colors.darkerGray,
    fontSize: 18,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: '500',
  },
  icon: {
    width: 68,
    height: 68,
    resizeMode: 'contain',
  },
});
