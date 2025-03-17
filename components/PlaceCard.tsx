import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../app/_layout';

interface PlaceCardProps {
  title: string;
  address: string;
  rating: number;
  category: string;
  imageUrl: string;
}

export function PlaceCard({ title, address, rating, category, imageUrl }: PlaceCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{address}</Text>
          <FontAwesome5 name="map-marker-alt" size={12} color={theme.colors.white} />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {rating}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
        {/*
        <View style={styles.actions}>
          <FontAwesome5 name="heart" size={18} color={theme.colors.primaryPurple} />
          <FontAwesome5 name="comment-alt" size={18} color={theme.colors.primaryPurple} style={styles.commentIcon} />  
        </View>
        */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  addressContainer: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
    marginRight: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.softPurple,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: theme.fonts.ibmPlexSans,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginRight: 8,
  },
  categoryTag: {
    backgroundColor: theme.colors.primaryPurple,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: theme.fonts.ibmPlexSans,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    marginLeft: 12,
  },
});
