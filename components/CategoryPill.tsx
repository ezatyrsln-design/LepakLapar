// components/CategoryPill.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ICONS: Record<string, string> = {
  All:     '🍽️',
  Rice:    '🍚',
  Noodles: '🍜',
  Bread:   '🫓',
  Drinks:  '🧋',
  Snacks:  '🍟',
  Others:  '🥘',
};

const CategoryPill: React.FC<Props> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, selected && styles.pillSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.icon}>{ICONS[label] || '🍴'}</Text>
    <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  pillSelected: {
    backgroundColor: '#FF6161',
    borderColor: '#FF6161',
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  labelSelected: {
    color: '#fff',
  },
});

export default CategoryPill;