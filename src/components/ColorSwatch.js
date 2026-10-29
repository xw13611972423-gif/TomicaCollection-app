import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { isLightHex } from '../constants';

export default function ColorSwatch({ name, hex, selected, onPress, size = 44 }) {
  const light = isLightHex(hex);
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: hex },
          selected && styles.selected,
        ]}
      >
        {selected && <Text style={[styles.check, { color: light ? '#000' : '#fff' }]}>✓</Text>}
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 56, marginVertical: 6 },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: '#1E88E5' },
  check: { fontSize: 16, fontWeight: 'bold' },
  name: { fontSize: 11, color: '#555', marginTop: 3 },
});
