import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { isLightHex } from '../constants';
import { useSettings } from '../SettingsStore';

export default function ColorSwatch({ name, hex, selected, onPress, size = 44 }) {
  const { theme } = useSettings();
  const light = isLightHex(hex);
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: hex },
          selected && { borderColor: theme.accent },
        ]}
      >
        {selected && <Text style={[styles.check, { color: light ? '#000' : '#fff' }]}>✓</Text>}
      </View>
      <Text style={[styles.name, { color: theme.text2 }]} numberOfLines={1}>{name}</Text>
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
  check: { fontSize: 16, fontWeight: 'bold' },
  name: { fontSize: 11, marginTop: 3 },
});
