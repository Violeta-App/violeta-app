import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

interface ReportCardProps {
    location: string;
    timestamp: string;
    category: string;
    description?: string;
}

export function ReportCard({ location, timestamp, category, description }: ReportCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <TouchableOpacity style={[styles.card, isExpanded && styles.expandedCard]} onPress={() => setIsExpanded(!isExpanded)}>
            <View style={styles.header}>
                <View style={styles.locationContainer}>
                    <FontAwesome5 name="map-marker-alt" size={14} color={theme.colors.black} style={styles.locationIcon} />
                    <Text style={styles.location}>{location}</Text>
                </View>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.category}>{category}</Text>
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
        backgroundColor: theme.colors.primaryPurple,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    expandedCard: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        marginRight: 6,
    },
    location: {
        fontSize: 14,
        fontFamily: theme.fonts.ibmPlexSans,
        fontWeight: 'regular',
        color: theme.colors.black,
    },
    timestamp: {
        fontSize: 12,
        fontFamily: theme.fonts.ibmPlexSans,
        color: theme.colors.black,
    },
    categoryContainer: {
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    category: {
        fontSize: 12,
        fontFamily: theme.fonts.ibmPlexSans,
        color: theme.colors.primaryPurple,
    },
    description: {
        fontSize: 14,
        fontFamily: theme.fonts.ibmPlexSans,
        color: theme.colors.black,
        marginTop: 8,
    },
    icon: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
});