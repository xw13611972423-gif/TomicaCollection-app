import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CarCard({ car, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {car.imageUri ? (
        <Image source={{ uri: car.imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderIcon}>🚗</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.model} numberOfLines={1}>{car.modelName}</Text>
        <View style={styles.colorRow}>
          <View style={[styles.dot, { backgroundColor: car.colorHex || '#999' }]} />
          <Text style={styles.color} numberOfLines={1}>{car.colorName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: '#eee',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: { fontSize: 40 },
  info: { padding: 10 },
  model: { fontSize: 14, fontWeight: '600', color: '#222' },
  colorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  color: { fontSize: 12, color: '#888' },
});
