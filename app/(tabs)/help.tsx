// app/(tabs)/help.tsx — Help Screen
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const faqs = [
  {
    q: 'How do I save a favourite food?',
    a: 'Tap the ❤️ icon on any food card or inside the food detail page. The food will be saved to your Favourites list.',
  },
  {
    q: 'How does the GET API work?',
    a: 'The app fetches real Malaysian food data from TheMealDB API (https://www.themealdb.com) when it loads. If the API fails, fallback local data is used automatically.',
  },
  {
    q: 'How does the POST API work?',
    a: 'When you tap "Add Food & POST to API" or the 📤 button in Favourites, the app sends food data to jsonplaceholder.typicode.com using a POST request. A success alert shows the API response ID.',
  },
  {
    q: 'How do I search for food?',
    a: 'Tap the Search tab at the bottom, then type the food name, category or location. Results appear automatically as you type.',
  },
  {
    q: 'Are the prices accurate?',
    a: 'Prices shown are estimates based on typical warung prices near UTeM. Actual prices may vary.',
  },
  {
    q: 'What does "Not Available" mean?',
    a: 'It means the food item is currently not being sold. Please check back later.',
  },
  {
    q: 'How do I group food by category?',
    a: 'On the Home screen, tap "Group by Category" button on the top right. This switches from FlatList to SectionList view.',
  },
  {
    q: 'How do I remove a favourite?',
    a: 'Go to the Favourites tab, tap the ❤️ icon on the food you want to remove, then confirm by tapping "Remove".',
  },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FF6161" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Help ❓</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🍜</Text>
          <View>
            <Text style={styles.bannerTitle}>LepakLapar</Text>
            <Text style={styles.bannerSub}>Lepak. Eat. Repeat.</Text>
          </View>
        </View>

        {/* API Info Box */}
        <View style={styles.apiBox}>
          <Text style={styles.apiTitle}>🌐 API Information</Text>
          <View style={styles.apiRow}>
            <View style={styles.methodBadge}>
              <Text style={styles.methodText}>GET</Text>
            </View>
            <Text style={styles.apiUrl}>themealdb.com — Malaysian food data</Text>
          </View>
          <View style={styles.apiRow}>
            <View style={[styles.methodBadge, styles.postBadge]}>
              <Text style={styles.methodText}>POST</Text>
            </View>
            <Text style={styles.apiUrl}>jsonplaceholder.typicode.com/posts</Text>
          </View>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqItem}
            onPress={() => setOpenIndex(openIndex === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={styles.faqArrow}>{openIndex === i ? '▲' : '▼'}</Text>
            </View>
            {openIndex === i && (
              <Text style={styles.faqA}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact Box */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>📧 Contact Us</Text>
          <Text style={styles.contactText}>lepaklapar@utem.edu.my</Text>
          <Text style={styles.contactText}>Universiti Teknikal Malaysia Melaka</Text>
          <Text style={styles.contactText}>Faculty of Artificial Intelligence & Cyber Security</Text>
        </View>

        <Text style={styles.version}>Version 1.0.0 • © 2025 LepakLapar</Text>
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FF6161',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  bannerEmoji: {
    fontSize: 40,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  bannerSub: {
    color: '#ffcccc',
    fontSize: 13,
    marginTop: 2,
  },
  apiBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  apiTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  apiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  methodBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  postBadge: {
    backgroundColor: '#2980B9',
  },
  methodText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  apiUrl: {
    color: '#aaa',
    fontSize: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 10,
  },
  faqArrow: {
    color: '#FF6161',
    fontSize: 12,
    fontWeight: '700',
  },
  faqA: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  contactBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffcccc',
    gap: 4,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6161',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#555',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#bbb',
    marginTop: 24,
  },
});