// app/(tabs)/index.js — Home Screen
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  View,
} from 'react-native';
import CategoryPill from '../../components/CategoryPill';
import FoodCard from '../../components/FoodCard';
import StatsBar from '../../components/StatsBar';

const CATEGORIES = ['All', 'Rice', 'Noodles', 'Bread', 'Drinks', 'Snacks', 'Others'];

const CATEGORY_COLORS = {
  Rice:    '#27AE60',
  Noodles: '#2980B9',
  Bread:   '#E67E22',
  Drinks:  '#8E44AD',
  Snacks:  '#F39C12',
  Others:  '#C0392B',
};

const fallbackFoods = [
  { id: '1', name: 'Nasi Lemak', category: 'Rice', price: 3.50, rating: 4.6, reviews: 230, location: 'UTeM Cafeteria', distance: '0.1 km', tag: 'Traditional', description: 'Fragrant coconut rice served with spicy sambal, crispy anchovies, roasted peanuts and hard-boiled egg.', image: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg', available: true },
  { id: '2', name: 'Mee Goreng Mamak', category: 'Noodles', price: 5.00, rating: 4.5, reviews: 180, location: 'Mamak Near UTeM', distance: '0.3 km', tag: 'Popular', description: 'Stir-fried yellow noodles with egg, tofu and sweet spicy sauce.', image: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg', available: true },
  { id: '3', name: 'Roti Canai', category: 'Bread', price: 2.00, rating: 4.4, reviews: 310, location: 'Mamak Wawasan', distance: '0.2 km', tag: 'Cheap & Delicious', description: 'Crispy flatbread served with dhal or curry sauce.', image: 'https://www.themealdb.com/images/media/meals/hx335q1619789561.jpg', available: true },
  { id: '4', name: 'Teh Tarik', category: 'Drinks', price: 1.50, rating: 4.7, reviews: 420, location: 'Mamak Near UTeM', distance: '0.3 km', tag: 'Must Have', description: 'Sweet and creamy pulled milk tea, perfectly frothed.', image: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg', available: true },
  { id: '5', name: 'Nasi Ayam', category: 'Rice', price: 5.50, rating: 4.3, reviews: 150, location: 'Pak Long Chicken Rice', distance: '0.4 km', tag: 'Best Seller', description: 'Fragrant steamed rice with grilled chicken, clear soup and ginger sauce.', image: 'https://www.themealdb.com/images/media/meals/sytuqu1511882583.jpg', available: true },
  { id: '6', name: 'Char Kuey Teow', category: 'Noodles', price: 6.00, rating: 4.8, reviews: 200, location: 'Roadside Stall UTeM', distance: '0.5 km', tag: 'Must Try', description: 'Stir-fried flat rice noodles with prawns, egg and bean sprouts.', image: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg', available: false },
  { id: '7', name: 'Roti Telur', category: 'Bread', price: 2.50, rating: 4.2, reviews: 95, location: 'Mamak Wawasan', distance: '0.2 km', tag: 'Breakfast', description: 'Egg-filled flatbread fried crispy and golden.', image: 'https://www.themealdb.com/images/media/meals/hx335q1619789561.jpg', available: true },
  { id: '8', name: 'Mee Kari', category: 'Noodles', price: 5.50, rating: 4.6, reviews: 170, location: 'UTeM Cafeteria', distance: '0.1 km', tag: 'Spicy', description: 'Noodles in thick curry broth with tofu and boiled egg.', image: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg', available: true },
  { id: '9', name: 'Pisang Goreng', category: 'Snacks', price: 1.00, rating: 4.5, reviews: 280, location: 'Stall Near UTeM', distance: '0.2 km', tag: 'Afternoon Snack', description: 'Hot crispy fried banana fritters.', image: 'https://www.themealdb.com/images/media/meals/1550441275.jpg', available: true },
  { id: '10', name: 'Satay', category: 'Others', price: 1.20, rating: 4.7, reviews: 190, location: 'Pak Ali Satay Stall', distance: '0.6 km', tag: 'Per Stick', description: 'Grilled chicken and beef skewers with rich peanut sauce.', image: 'https://www.themealdb.com/images/media/meals/1548772327.jpg', available: true },
  { id: '11', name: 'Kopi O', category: 'Drinks', price: 1.50, rating: 4.4, reviews: 130, location: 'Nearby Coffee Shop', distance: '0.3 km', tag: 'Morning & Evening', description: 'Strong black coffee without milk.', image: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg', available: true },
  { id: '12', name: 'Nasi Goreng', category: 'Rice', price: 4.50, rating: 4.3, reviews: 210, location: 'Mamak Near UTeM', distance: '0.3 km', tag: 'Dinner', description: 'Fried rice with egg, vegetables and sausage.', image: 'https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg', available: true },
];

const fetchMalaysianFood = async () => {
  try {
    const MEALDB_URL = 'https://www.themealdb.com/api/json/v1/1';
    const response = await fetch(`${MEALDB_URL}/filter.php?a=Malaysian`);
    const data = await response.json();
    if (!data.meals) return [];
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 12).map(async (meal) => {
        const detailRes = await fetch(`${MEALDB_URL}/lookup.php?i=${meal.idMeal}`);
        const detailData = await detailRes.json();
        const m = detailData.meals[0];
        const locations = ['UTeM Cafeteria','Mamak Near UTeM','Mamak Wawasan','Roadside Stall UTeM','Pak Long Stall','Stall Near UTeM'];
        const prices = [1.50,2.00,2.50,3.50,4.50,5.00,5.50,6.00];
        const distances = ['0.1 km','0.2 km','0.3 km','0.4 km','0.5 km','0.6 km'];
        const n = m.strMeal.toLowerCase();
        let category = 'Others';
        if (n.includes('nasi') || n.includes('rice')) category = 'Rice';
        else if (n.includes('mee') || n.includes('noodle') || n.includes('laksa')) category = 'Noodles';
        else if (n.includes('roti') || n.includes('bread')) category = 'Bread';
        else if (n.includes('teh') || n.includes('kopi')) category = 'Drinks';
        else if (n.includes('goreng') || n.includes('snack')) category = 'Snacks';
        return {
          id: m.idMeal,
          name: m.strMeal,
          category,
          price: prices[Math.floor(Math.random() * prices.length)],
          rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
          reviews: Math.floor(Math.random() * 400) + 50,
          location: locations[Math.floor(Math.random() * locations.length)],
          distance: distances[Math.floor(Math.random() * distances.length)],
          tag: m.strTags ? m.strTags.split(',')[0] : 'Malaysian',
          description: m.strInstructions ? m.strInstructions.substring(0, 120) + '...' : 'A delicious Malaysian dish.',
          image: m.strMealThumb,
          available: Math.random() > 0.2,
        };
      })
    );
    return detailedMeals;
  } catch (error) {
    return [];
  }
};

export default function HomeScreen() {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [favourites, setFavourites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadFoods = async () => {
      setIsLoading(true);
      try {
        const result = await fetchMalaysianFood();
        setFoods(result && result.length > 0 ? result : fallbackFoods);
      } catch (error) {
        setFoods(fallbackFoods);
      } finally {
        setIsLoading(false);
      }
    };
    loadFoods();
  }, []);

  const filtered = foods.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const sections = CATEGORIES.filter((c) => c !== 'All').map((cat) => ({
    title: cat,
    color: CATEGORY_COLORS[cat] || '#FF6161',
    data: foods.filter((f) => f.category === cat),
  })).filter((s) => s.data.length > 0);

  const handleToggleFavourite = (item) => {
    setFavourites((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const handleFoodPress = (item) => {
    router.push({
      pathname: '/food-detail',
      params: { food: JSON.stringify(item), isFavourite: favourites.includes(item.id) ? 'true' : 'false' },
    });
  };

  const ListHeader = () => (
    <>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Category</Text>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'list' ? 'section' : 'list')}>
          <Text style={styles.seeAll}>{viewMode === 'list' ? 'Group by Category' : 'Show All'}</Text>
        </TouchableOpacity>
      </View>
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
            onPress={() => { setSelectedCategory(item); setViewMode('list'); }}
          />
        )}
      />
      <StatsBar count={viewMode === 'list' ? filtered.length : foods.length} category={selectedCategory} />
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{viewMode === 'section' ? '📋 Grouped by Category' : '🔥 Popular Now'}</Text>
      </View>
    </>
  );

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
      <StatusBar backgroundColor="#FF6161" barStyle="light-content" />
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
      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/explore')} activeOpacity={0.8}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search for food...</Text>
      </TouchableOpacity>
      {viewMode === 'section' ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListHeader />}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
              <Text style={[styles.sectionHeaderText, { color: section.color }]}>{section.title} ({section.data.length})</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <FoodCard item={item} isFavourite={favourites.includes(item.id)} onPress={() => handleFoodPress(item)} onToggleFavourite={() => handleToggleFavourite(item)} />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item }) => (
            <FoodCard item={item} isFavourite={favourites.includes(item.id)} onPress={() => handleFoodPress(item)} onToggleFavourite={() => handleToggleFavourite(item)} />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const EmptyState = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyEmoji}>🍽️</Text>
    <Text style={styles.emptyText}>No food found</Text>
    <Text style={styles.emptySub}>Try a different category</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 100, backgroundColor: '#FFF8F5' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8F5', gap: 12 },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 12 },
  loadingSubText: { fontSize: 13, color: '#999' },
  header: { backgroundColor: '#FF5852', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#ffcccc', fontSize: 13 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  headerIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  mascotImg: { width: '100%', height: '100%'},
  headerEmoji: { fontSize: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: -16, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, gap: 10 },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { color: '#aaa', fontSize: 14, flex: 1 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  seeAll: { fontSize: 13, color: '#FF6161', fontWeight: '600' },
  catList: { paddingHorizontal: 16, gap: 8 },
  sectionHeader: { marginHorizontal: 16, marginTop: 16, marginBottom: 8, paddingLeft: 10, borderLeftWidth: 4, borderRadius: 2 },
  sectionHeaderText: { fontSize: 15, fontWeight: '800' },
  list: { paddingBottom: 20, paddingTop: 20 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#333' },
  emptySub: { fontSize: 13, color: '#999', marginTop: 4 },
});