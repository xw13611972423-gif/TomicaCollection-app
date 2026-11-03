import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../SettingsStore';

export default function CarCard({ car, onPress }) {
  const { theme, glass } = useSettings();
  const s = createStyles(theme);
  const cardStyle = glass
    ? { backgroundColor: theme.glass, borderColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderColor: theme.border };

  return (
    <TouchableOpacity style={[s.card, cardStyle]} onPress={onPress} activeOpacity={0.85}>
      {car.imageUri ? (
        <Image source={{ uri: car.imageUri }} style={s.image} resizeMode="cover" />
      ) : (
        <View style={[s.image, s.placeholder]}>
          <Text style={s.placeholderIcon}>🚗</Text>
        </View>
      )}
      <View style={s.info}>
        <Text style={s.model} numberOfLines={1}>{car.modelName}</Text>
        <View style={s.colorRow}>
          <View style={[s.dot, { backgroundColor: car.colorHex || '#999' }]} />
          <Text style={s.color} numberOfLines={1}>{car.colorName}</Text>
        </View>
        {car.price ? (
          <Text style={s.price} numberOfLines={1}>{car.currency}{car.price}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    card: {
      flex: 1,
      margin: 6,
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    image: { width: '100%', height: 130, backgroundColor: theme.chip },
    placeholder: { alignItems: 'center', justifyContent: 'center' },
    placeholderIcon: { fontSize: 40 },
    info: { padding: 11 },
    model: { fontSize: 14, fontWeight: '600', color: theme.text },
    colorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
    color: { fontSize: 12, color: theme.text3 },
    price: { fontSize: 13, fontWeight: '600', color: theme.danger, marginTop: 5 },
  });
}
