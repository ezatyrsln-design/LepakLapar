// app/(tabs)/explore.tsx — Search Screen
import { FoodItem, fallbackFoods } from '@/app/data';
import { fetchMalaysianFood } from '@/app/services';
import FoodCard from '@/components/FoodCard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchScreen() {
  // ── State ────────────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>([]);
  const router = useRouter();

  // ── GET API call on mount ────────────────────────────────────
  useEffect(() => {
    const loadFoods = async () => {
      setIsLoading(true);
      try {
        // GET request to TheMealDB API
        const result = await fetchMalaysianFood();
        if (result && result.length > 0) {
          setFoods(result);
        } else {
          setFoods(fallbackFoods);
        }
      } catch (error) {
        console.log('Search screen fetch error:', error);
        setFoods(fallbackFoods);
      } finally {
        setIsLoading(false);
      }
    };

    loadFoods();
  }, []);

  // ── Filter based on search query ─────────────────────────────
  const results = query.length > 0
    ? foods.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.category.toLowerCase().includes(query.toLowerCase()) ||
        f.location.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // ── Toggle favourite ─────────────────────────────────────────
  const handleToggleFavourite = (item: FoodItem) => {
    setFavourites((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  // ── Navigate to detail ───────────────────────────────────────
  const handleFoodPress = (item: FoodItem) => {
    router.push({
      pathname: '/food-detail',
      params: {
        food: JSON.stringify(item),
        isFavourite: favourites.includes(item.id) ? 'true' : 'false',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FF6161" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Food 🔍</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Type food name, category..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6161" />
          <Text style={styles.loadingText}>Loading food data...</Text>
        </View>

      /* Empty query — show hint */
      ) : query.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hintEmoji}>🍜</Text>
          <Text style={styles.hintText}>Try searching "Nasi Lemak" or "Rice"</Text>
          <Text style={styles.hintSub}>{foods.length} food items loaded from API</Text>
        </View>

      /* No results */
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hintEmoji}>😅</Text>
          <Text style={styles.hintText}>No results for "{query}"</Text>
          <Text style={styles.hintSub}>Try a different keyword</Text>
        </View>

      /* Results list */
      ) : (
        <>
          <Text style={styles.resultCount}>
            {results.length} food item(s) found
          </Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FoodCard
                item={item}
                isFavourite={favourites.includes(item.id)}
                onPress={() => handleFoodPress(item)}
                onToggleFavourite={() => handleToggleFavourite(item)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </>
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
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    gap: 10,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    padding: 0,
  },
  clear: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  hintEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
  hintSub: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  resultCount: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
});