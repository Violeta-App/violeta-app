import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

interface ReportCommentProps {
  user: string;
  timestamp: string;
  categories: string[];
  description?: string;
}

export function ReportComment({ user, timestamp, categories, description }: ReportCommentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={() => setIsExpanded(!isExpanded)}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/*
          <View style={styles.avatar}>
            <FontAwesome5 name="user-circle" size={24} color={theme.colors.darkGray} />
          </View>
          */}
          <Text style={styles.userName}>{user}</Text>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
      </View>
      {isExpanded && description && <Text style={styles.description}>{description}</Text>}
      <FontAwesome5
        name={isExpanded ? "chevron-up" : "chevron-down"}
        size={14}
        color={theme.colors.black}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.softPurple,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.darkGray,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.darkGray,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryTag: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.primaryPurple,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
    marginTop: 8,
  },
  icon: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
});