// components/FoodCard.js
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Category colors defined directly here — no import needed
const CATEGORY_COLORS = {
  Rice:    '#27AE60',
  Noodles: '#2980B9',
  Bread:   '#E67E22',
  Drinks:  '#8E44AD',
  Snacks:  '#F39C12',
  Others:  '#C0392B',
};

const FoodCard = ({ item, isFavourite, onPress, onToggleFavourite }) => {
  const catColor = CATEGORY_COLORS[item.category] || '#FF6161';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        {!item.available && (
          <View style={styles.unavailOverlay}>
            <Text style={styles.unavailText}>Not Available</Text>
          </View>
        )}

        <View style={[styles.catBadge, { backgroundColor: catColor }]}>
          <Text style={styles.catBadgeText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.midRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.category, { color: catColor }]}>{item.category}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.location} numberOfLines={1}>📍 {item.location}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 160, backgroundColor: '#f5f5f5' },
  unavailOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  heartBtn: {
    position: 'absolute',
    top: 10, right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 36, height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  heart: { fontSize: 18 },
  catBadge: {
    position: 'absolute',
    bottom: 10, left: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  catBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { padding: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', flex: 1, marginRight: 8 },
  price: { fontSize: 16, fontWeight: '800', color: '#FF6161' },
  midRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  rating: { fontSize: 13, color: '#555' },
  dot: { color: '#ccc' },
  category: { fontSize: 13, fontWeight: '600' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { fontSize: 12, color: '#888', flex: 1 },
  distance: { fontSize: 12, color: '#FF6161', fontWeight: '600' },
});

export default FoodCard;