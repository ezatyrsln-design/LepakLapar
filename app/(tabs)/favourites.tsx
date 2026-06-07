// app/(tabs)/favourites.tsx — Favourites Screen
import { FoodItem, fallbackFoods } from '@/app/data';
import { postFavourite } from '@/app/services';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FavouritesScreen() {
  // ── State ────────────────────────────────────────────────────
  const [favourites, setFavourites] = useState<FoodItem[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [lastPosted, setLastPosted] = useState<string | null>(null);

  // ── Simulate some pre-saved favourites on load ───────────────
  useEffect(() => {
    // Pre-load 2 favourites as demo
    setFavourites(fallbackFoods.slice(0, 2));
  }, []);

  // ── POST METHOD — Save new favourite to API ──────────────────
  const handlePostFavourite = async (item: FoodItem) => {
    setIsPosting(true);
    try {
      // POST request to jsonplaceholder
      const result = await postFavourite(item);

      if (result) {
        setLastPosted(item.name);
        Alert.alert(
          '✅ POST Success!',
          `"${item.name}" was sent to the API!\n\nAPI Response ID: ${result.id}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('❌ POST Failed', 'Could not send to API. Try again.', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Something went wrong with the POST request.', [{ text: 'OK' }]);
    } finally {
      setIsPosting(false);
    }
  };

  // ── Remove favourite with confirm Alert ──────────────────────
  const handleRemove = (item: FoodItem) => {
    Alert.alert(
      'Remove Favourite?',
      `Remove "${item.name}" from your favourites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            setFavourites((prev) => prev.filter((f) => f.id !== item.id)),
        },
      ]
    );
  };

  // ── Clear all with confirm Alert ─────────────────────────────
  const handleClearAll = () => {
    Alert.alert(
      'Clear All?',
      'Remove all food from your favourites list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setFavourites([]),
        },
      ]
    );
  };

  // ── Add food to favourites ───────────────────────────────────
  const handleAddDemo = () => {
    const notAdded = fallbackFoods.filter(
      (f) => !favourites.find((fav) => fav.id === f.id)
    );
    if (notAdded.length === 0) {
      Alert.alert('All Added!', 'All food items are already in your favourites.');
      return;
    }
    const toAdd = notAdded[0];
    setFavourites((prev) => [...prev, toAdd]);

    // Automatically POST to API when adding
    handlePostFavourite(toAdd);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FF6161" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favourites ❤️</Text>
        {favourites.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAll}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* POST API Status Banner */}
      {isPosting && (
        <View style={styles.postingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.postingText}>Sending to API...</Text>
        </View>
      )}

      {lastPosted && !isPosting && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            ✅ POST Success — "{lastPosted}" sent to API
          </Text>
        </View>
      )}

      {/* Add Demo Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={handleAddDemo}
        disabled={isPosting}
      >
        <Text style={styles.addBtnText}>
          ➕ Add Food & POST to API
        </Text>
      </TouchableOpacity>

      {/* Empty State */}
      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyTitle}>No Favourites Yet</Text>
          <Text style={styles.emptySub}>
            Tap "Add Food & POST to API" to add and send to API!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.count}>
              {favourites.length} item(s) • Tap ➕ to POST new item to API
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Food Image */}
              <Image
                source={{ uri: item.image }}
                style={styles.img}
                resizeMode="cover"
              />

              {/* Food Info */}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.location} numberOfLines={1}>
                    {item.distance}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                {/* POST button */}
                <TouchableOpacity
                  style={styles.postBtn}
                  onPress={() => handlePostFavourite(item)}
                  disabled={isPosting}
                >
                  <Text style={styles.postBtnText}>📤</Text>
                </TouchableOpacity>

                {/* Remove button */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemove(item)}
                >
                  <Text style={styles.removeBtnText}>❤️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  header: {
    backgroundColor: '#FF6161',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  clearAll: {
    fontSize: 22,
  },
  postingBanner: {
    backgroundColor: '#2980B9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  postingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: '#27AE60',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: '#FF6161',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  count: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  img: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF6161',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  dot: {
    color: '#ccc',
    fontSize: 12,
  },
  location: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  actions: {
    flexDirection: 'column',
    padding: 8,
    gap: 6,
  },
  postBtn: {
    backgroundColor: '#2980B9',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnText: {
    fontSize: 16,
  },
  removeBtn: {
    backgroundColor: '#FFF0F0',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 16,
  },
});