import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

interface LocationCardProps {
    title: string;
    rating: string;
    distance: string;
    category: string;
}

export function LocationCard({ title, rating, distance, category }: LocationCardProps) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('location-details')} style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.rating}>{rating} ★</Text>
                <Text style={styles.distance}> · {distance}</Text>
            </View>
            <View style={styles.categoryContainer}>
                <Text style={styles.category}>{category}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.beige,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: theme.colors.primaryPurple,
    },
    title: {
        fontSize: 16,
        fontFamily: theme.fonts.ibmPlexSans,
        fontWeight: 'bold',
        color: theme.colors.black,
        marginBottom: 4,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    rating: {
        fontSize: 14,
        fontFamily: theme.fonts.ibmPlexSans,
        color: theme.colors.black,
    },
    distance: {
        fontSize: 14,
        fontFamily: theme.fonts.ibmPlexSans,
        color: theme.colors.black,
    },
    categoryContainer: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: theme.colors.primaryPurple,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    category: {
        fontSize: 12,
        fontFamily: theme.fonts.ibmPlexSans,
        color: theme.colors.white,
    },
});