// app/(tabs)/index.tsx — Home Screen
import { CATEGORIES, CATEGORY_COLORS, FoodItem, fallbackFoods } from '@/app/data';
import { fetchMalaysianFood } from '@/app/services';
import CategoryPill from '@/components/CategoryPill';
import FoodCard from '@/components/FoodCard';
import StatsBar from '@/components/StatsBar';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  // ── State ────────────────────────────────────────────────────
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'section'>('list');
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
          // Use fallback if API returns empty
          setFoods(fallbackFoods);
        }
      } catch (error) {
        console.log('Error fetching foods:', error);
        setFoods(fallbackFoods);
      } finally {
        setIsLoading(false);
      }
    };

    loadFoods();
  }, []);

  // ── Filtered list for FlatList mode ─────────────────────────
  const filtered = foods.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  // ── Grouped data for SectionList mode ───────────────────────
  const sections = CATEGORIES.filter((c) => c !== 'All').map((cat) => ({
    title: cat,
    color: CATEGORY_COLORS[cat] || '#FF6161',
    data: foods.filter((f) => f.category === cat),
  })).filter((s) => s.data.length > 0);

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

  // ── List Header component ────────────────────────────────────
  const ListHeader = () => (
    <>
      {/* Category Filter */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Category</Text>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'list' ? 'section' : 'list')}
        >
          <Text style={styles.seeAll}>
            {viewMode === 'list' ? 'Group by Category' : 'Show All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Pills */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(cat) => cat}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        renderItem={({ item }) => (
          <CategoryPill
            label={item}
            selected={selectedCategory === item}
            onPress={() => {
              setSelectedCategory(item);
              setViewMode('list');
            }}
          />
        )}
      />

      {/* Stats Bar */}
      <StatsBar
        count={viewMode === 'list' ? filtered.length : foods.length}
        category={selectedCategory}
      />

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {viewMode === 'section' ? '📋 Grouped by Category' : '🔥 Popular Now'}
        </Text>
      </View>
    </>
  );

  // ── Loading screen ───────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6161" />
        <Text style={styles.loadingText}>Finding food near UTeM...</Text>
        <Text style={styles.loadingSubText}>Fetching from API...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FF6161" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.headerTitle}>LepakLapar</Text>
        </View>
        <View style={styles.headerIcon}>
          <Image 
            source={require('@/assets/images/mascot.png')} 
            style={styles.mascotImg}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Search Bar — navigates to search tab 
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/search')}
        activeOpacity={0.8}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search for food...</Text>
      </TouchableOpacity>*/}

      {/* SectionList mode */}
      {viewMode === 'section' ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListHeader />}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
              <Text style={[styles.sectionHeaderText, { color: section.color }]}>
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              isFavourite={favourites.includes(item.id)}
              onPress={() => handleFoodPress(item)}
              onToggleFavourite={() => handleToggleFavourite(item)}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        /* FlatList mode */
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              isFavourite={favourites.includes(item.id)}
              onPress={() => handleFoodPress(item)}
              onToggleFavourite={() => handleToggleFavourite(item)}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

// ── Empty State Component ────────────────────────────────────────
const EmptyState = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyEmoji}>🍽️</Text>
    <Text style={styles.emptyText}>No food found</Text>
    <Text style={styles.emptySub}>Try a different category</Text>
  </View>
);

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 100,
    backgroundColor: '#FFF8F5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F5',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  loadingSubText: {
    fontSize: 13,
    color: '#999',
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
  greeting: {
    color: '#ffcccc',
    fontSize: 13,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mascotImg: {
    width: '100%',
    height: '100%',
  },
  headerEmoji: {
    fontSize: 20,
  },
  searchBar: {
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
  searchIcon: {
    fontSize: 16,
  },
  searchPlaceholder: {
    color: '#aaa',
    fontSize: 14,
    flex: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  seeAll: {
    fontSize: 13,
    color: '#FF6161',
    fontWeight: '600',
  },
  catList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderRadius: 2,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: '800',
  },
  list: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  emptySub: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});