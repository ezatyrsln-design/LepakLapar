// app/(tabs)/favourites.js — Favourites Screen
import { useEffect, useState } from 'react';
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

// Fallback foods defined directly here — no import needed
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

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const postFavourite = async (food) => {
  try {
    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: food.name,
        body: food.description,
        foodId: food.id,
        category: food.category,
        price: food.price,
        rating: food.rating,
        location: food.location,
        userId: 1,
      }),
    });
    const result = await response.json();
    console.log('POST Success:', result);
    return result;
  } catch (error) {
    console.log('POST Error:', error);
    return null;
  }
};

export default function FavouritesScreen() {
  const [favourites, setFavourites] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [lastPosted, setLastPosted] = useState(null);

  useEffect(() => {
    setFavourites(fallbackFoods.slice(0, 2));
  }, []);

  const handlePostFavourite = async (item) => {
    setIsPosting(true);
    try {
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

  const handleRemove = (item) => {
    Alert.alert(
      'Remove Favourite?',
      `Remove "${item.name}" from your favourites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setFavourites((prev) => prev.filter((f) => f.id !== item.id)),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All?',
      'Remove all food from your favourites list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setFavourites([]) },
      ]
    );
  };

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
    handlePostFavourite(toAdd);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FF6161" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Favourites ❤️</Text>
        {favourites.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAll}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      {isPosting && (
        <View style={styles.postingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.postingText}>Sending to API...</Text>
        </View>
      )}

      {lastPosted && !isPosting && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✅ POST Success — "{lastPosted}" sent to API</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addBtn} onPress={handleAddDemo} disabled={isPosting}>
        <Text style={styles.addBtnText}>➕ Add Food & POST to API</Text>
      </TouchableOpacity>

      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyTitle}>No Favourites Yet</Text>
          <Text style={styles.emptySub}>Tap "Add Food & POST to API" to add!</Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.count}>
              {favourites.length} item(s) • Tap ➕ to POST new item
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.location} numberOfLines={1}>{item.distance}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.postBtn}
                  onPress={() => handlePostFavourite(item)}
                  disabled={isPosting}
                >
                  <Text style={styles.postBtnText}>📤</Text>
                </TouchableOpacity>
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
  safe: { flex: 1, backgroundColor: '#FFF8F5' },
  header: { backgroundColor: '#FF6161', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  clearAll: { fontSize: 22 },
  postingBanner: { backgroundColor: '#2980B9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 8 },
  postingText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  successBanner: { backgroundColor: '#27AE60', paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  successText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  addBtn: { backgroundColor: '#FF6161', marginHorizontal: 16, marginTop: 14, marginBottom: 4, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#999', textAlign: 'center', paddingHorizontal: 40 },
  list: { padding: 16, gap: 12 },
  count: { fontSize: 12, color: '#888', fontStyle: 'italic', marginBottom: 8 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, alignItems: 'center' },
  img: { width: 90, height: 90 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '800', color: '#FF6161', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rating: { fontSize: 12, color: '#666' },
  dot: { color: '#ccc', fontSize: 12 },
  location: { fontSize: 12, color: '#999', flex: 1 },
  actions: { flexDirection: 'column', padding: 8, gap: 6 },
  postBtn: { backgroundColor: '#2980B9', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  postBtnText: { fontSize: 16 },
  removeBtn: { backgroundColor: '#FFF0F0', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { fontSize: 16 },
});