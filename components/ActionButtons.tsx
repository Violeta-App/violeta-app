import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { theme } from '../app/_layout';

interface ButtonProps {
  title: string;
  backgroundColor: string;
  icon: string;
  destination: string;
}

const ActionButton = ({ title, backgroundColor, icon, destination }: ButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={() => navigation.navigate(destination)}
    >
      <FontAwesome5 name={icon} size={24} color={theme.colors.white} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export function ActionButtons() {
  return (
    <View style={styles.container}>
      <ActionButton
        title="Locais seguros próximos a você"
        backgroundColor={theme.colors.green}
        icon="shield-alt"
        destination="reports"
      />
      <ActionButton
        title="Alertas da comunidade"
        backgroundColor={theme.colors.orange}
        icon="exclamation-triangle"
        destination="reports"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: '500',
  },
});
