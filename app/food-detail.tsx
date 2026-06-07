// app/food-detail.tsx — Food Detail Screen
import { CATEGORY_COLORS, FoodItem } from '@/app/data';
import { getMyFavourites, postFavourite, removeFavouriteFromDB } from '@/app/services';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FoodDetailScreen() {
  // ── Get params passed from previous screen ───────────────────
  const { food, isFavourite: isFavParam } = useLocalSearchParams();
  const router = useRouter();

  const item: FoodItem = JSON.parse(food as string);
  const [isFavourite, setIsFavourite] = useState(isFavParam === 'true');
  const [isPosting, setIsPosting] = useState(false);

  const catColor = CATEGORY_COLORS[item.category] || '#FF6161';

  // ── VERIFY STATUS — Check the DB every time the page opens ─────────
  useFocusEffect(
    useCallback(() => {
      const verifyFavouriteStatus = async () => {
        // Fetch the current list of favorites from our fake DB
        const currentFavs: any = await getMyFavourites();
        
        // Check if THIS specific food item's ID is inside that list
        const isActuallySaved = currentFavs.some((fav: any) => fav.id === item.id);
        
        // Force the heart to turn red if it's found!
        setIsFavourite(isActuallySaved);
      };

      verifyFavouriteStatus();
    }, [item.id])
  );

  // ── POST — Save to API when adding favourite ─────────────────
  const handleFavourite = async () => {
    if (isFavourite) {
      // Remove favourite with confirm Alert
      Alert.alert(
        'Remove Favourite?',
        `Remove "${item.name}" from your favourites?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              setIsFavourite(false);
              removeFavouriteFromDB(item.id);
            },
          },
        ]
      );
    } else {
      // POST to API then add to favourite
      setIsPosting(true);
      try {
        const result = await postFavourite(item);
        setIsFavourite(true);

        if (result) {
          Alert.alert(
            '✅ Added & Posted!',
            `"${item.name}" added to Favourites!\n\nPOST API Response ID: ${result.id}`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            '❤️ Added!',
            `"${item.name}" added to Favourites!`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        setIsFavourite(true);
        Alert.alert(
          '❤️ Added!',
          `"${item.name}" added to Favourites!`,
          [{ text: 'OK' }]
        );
      } finally {
        setIsPosting(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FF6161" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Food Image */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Heart Button */}
          <TouchableOpacity style={styles.heartBtn} onPress={handleFavourite}>
            {isPosting
              ? <ActivityIndicator size="small" color="#FF6161" />
              : <Text style={styles.heartIcon}>{isFavourite ? '❤️' : '🤍'}</Text>
            }
          </TouchableOpacity>

          {/* Not Available Badge */}
          {!item.available && (
            <View style={styles.unavailBadge}>
              <Text style={styles.unavailText}>Not Available</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>

          {/* Dynamic Category Badge */}
          <View style={[styles.catBadge, { backgroundColor: catColor }]}>
            <Text style={styles.catText}>{item.category}</Text>
          </View>

          {/* Name & Price */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>
          </View>

          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐ {item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews} reviews)</Text>
            <View style={styles.dotView} />
            <Text style={[styles.tag, { color: catColor }]}>{item.tag}</Text>
          </View>

          <View style={styles.divider} />

          {/* Info Rows */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>
                {item.location} • {item.distance}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏷️</Text>
            <View>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={[styles.infoValue, { color: catColor }]}>
                {item.category}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💰</Text>
            <View>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>RM {item.price.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.desc}>{item.description}</Text>

          {/* Favourite Button */}
          <TouchableOpacity
            style={[
              styles.favBtn,
              { backgroundColor: isFavourite ? '#c94040' : '#FF6161' },
            ]}
            onPress={handleFavourite}
            disabled={isPosting}
          >
            {isPosting ? (
              <View style={styles.postingRow}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.favBtnText}>Sending POST to API...</Text>
              </View>
            ) : (
              <Text style={styles.favBtnText}>
                {isFavourite ? '❤️ Saved to Favourites' : '🤍 Add to Favourites'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Not Available Note */}
          {!item.available && (
            <Text style={styles.unavailNote}>
              ⚠️ This item is currently not available
            </Text>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#eee',
  },
  backBtn: {
    position: 'absolute',
    top: 16, left: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  heartIcon: {
    fontSize: 22,
  },
  unavailBadge: {
    position: 'absolute',
    bottom: 12, left: 12,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  unavailText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  catBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  catText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6161',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  star: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  reviews: {
    fontSize: 13,
    color: '#888',
  },
  dotView: {
    width: 4, height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  tag: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  favBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  postingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  favBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  unavailNote: {
    textAlign: 'center',
    fontSize: 13,
    color: '#FF6161',
    marginTop: 4,
  },
});