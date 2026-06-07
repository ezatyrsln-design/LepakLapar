// services/index.ts
// API service file — contains GET and POST methods

const MEALDB_URL = 'https://www.themealdb.com/api/json/v1/1';
const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

// ─────────────────────────────────────────────
// GET METHOD — Fetch Malaysian food from API
// ─────────────────────────────────────────────
export const fetchMalaysianFood = async () => {
  try {
    const response = await fetch(`${MEALDB_URL}/filter.php?a=Malaysian`);
    const data = await response.json();

    if (!data.meals) return [];

    // For each meal, fetch full details
    const detailedMeals = await Promise.all(
      data.meals.slice(0, 12).map(async (meal: any) => {
        const detailRes = await fetch(`${MEALDB_URL}/lookup.php?i=${meal.idMeal}`);
        const detailData = await detailRes.json();
        const m = detailData.meals[0];

        return {
          id: m.idMeal,
          name: m.strMeal,
          category: mapCategory(m.strMeal),
          price: randomPrice(),
          rating: randomRating(),
          reviews: Math.floor(Math.random() * 400) + 50,
          location: randomLocation(),
          distance: randomDistance(),
          tag: m.strTags ? m.strTags.split(',')[0] : 'Malaysian',
          description: m.strInstructions
            ? m.strInstructions.substring(0, 120) + '...'
            : 'A delicious Malaysian dish.',
          image: m.strMealThumb,
          available: Math.random() > 0.2, // 80% available
        };
      })
    );

    return detailedMeals;
  } catch (error) {
    console.log('GET Error:', error);
    return []; // return empty — App.tsx will use fallback
  }
};

// ─────────────────────────────────────────────
// POST METHOD — Save favourite food to API
// ─────────────────────────────────────────────
export const postFavourite = async (food: any) => {
  try {
    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────
const mapCategory = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('nasi') || n.includes('rice'))   return 'Rice';
  if (n.includes('mee') || n.includes('noodle') || n.includes('laksa')) return 'Noodles';
  if (n.includes('roti') || n.includes('bread'))  return 'Bread';
  if (n.includes('teh') || n.includes('kopi') || n.includes('drink'))   return 'Drinks';
  if (n.includes('goreng') || n.includes('snack')) return 'Snacks';
  return 'Others';
};

const randomPrice = (): number => {
  const prices = [1.50, 2.00, 2.50, 3.50, 4.50, 5.00, 5.50, 6.00];
  return prices[Math.floor(Math.random() * prices.length)];
};

const randomRating = (): number => {
  return parseFloat((Math.random() * 1 + 4).toFixed(1)); // 4.0 - 5.0
};

const randomLocation = (): string => {
  const locations = [
    'UTeM Cafeteria',
    'Mamak Near UTeM',
    'Mamak Wawasan',
    'Roadside Stall UTeM',
    'Pak Long Stall',
    'Stall Near UTeM',
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

const randomDistance = (): string => {
  const distances = ['0.1 km', '0.2 km', '0.3 km', '0.4 km', '0.5 km', '0.6 km'];
  return distances[Math.floor(Math.random() * distances.length)];
};