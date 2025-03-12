// components/ActionButtons.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

interface ButtonProps {
  title: string;
  backgroundColor: string;
  iconName: string;
}

const ActionButton = ({ title, backgroundColor, iconName }: ButtonProps) => (
  <TouchableOpacity style={[styles.button, { backgroundColor }]}> 
    <FontAwesome5 name={iconName} size={32} color={theme.colors.white} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export function ActionButtons() {
  return (
    <View style={styles.container}>
      <ActionButton title="Locais seguros próximos à você" backgroundColor={theme.colors.green} iconName="shield-alt" />
      <ActionButton title="Alertas da comunidade" backgroundColor={theme.colors.orange} iconName="exclamation-triangle" />
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
    paddingVertical: 20,
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
