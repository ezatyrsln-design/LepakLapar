// components/StatsBar.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  count: number;
  category: string;
}

const StatsBar: React.FC<Props> = ({ count, category }) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      {category === 'All'
        ? `Showing all ${count} food items near UTeM`
        : `${count} item${count !== 1 ? 's' : ''} in "${category}"`}
    </Text>
    <Text style={styles.pin}>📍 UTeM Area</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  pin: {
    fontSize: 12,
    color: '#FF6161',
    fontWeight: '600',
  },
});

export default StatsBar;