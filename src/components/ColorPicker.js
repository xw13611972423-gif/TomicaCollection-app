import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { hsvToHex, hexToHsv, isLightHex } from '../constants';

// 24 个色相（每 15° 一个）
const HUES = Array.from({ length: 24 }, (_, i) => i * 15);
const SAT_STEPS = 8; // 饱和度列数
const VAL_STEPS = 6; // 明度行数

export default function ColorPicker({ value = '#E53935', onChange }) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hexText, setHexText] = useState(value);

  // 外部 value 变化（如点预置色）时同步
  useEffect(() => {
    const current = hsvToHex(hsv.h, hsv.s, hsv.v);
    if ((value || '').toLowerCase() !== current.toLowerCase()) {
      setHsv(hexToHsv(value));
      setHexText(value);
    }
  }, [value]);

  const commit = (next) => {
    setHsv(next);
    const hex = hsvToHex(next.h, next.s, next.v);
    setHexText(hex);
    if (onChange) onChange(hex);
  };

  const applyHexText = (t) => {
    setHexText(t);
    const h = t.startsWith('#') ? t : '#' + t;
    if (/^#[0-9A-Fa-f]{6}$/.test(h)) {
      const next = hexToHsv(h);
      setHsv(next);
      if (onChange) onChange(h.toUpperCase());
    }
  };

  const isSel = (s, v) => Math.abs(s - hsv.s) < 0.06 && Math.abs(v - hsv.v) < 0.06;

  const satValues = Array.from({ length: SAT_STEPS }, (_, i) => i / (SAT_STEPS - 1));
  const valValues = Array.from({ length: VAL_STEPS }, (_, i) => 1 - i / (VAL_STEPS - 1));

  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>色相</Text>
      <View style={styles.hueRow}>
        {HUES.map((h) => {
          const active = Math.abs(h - hsv.h) < 8;
          return (
            <TouchableOpacity
              key={h}
              style={[styles.hueCell, { backgroundColor: hsvToHex(h, 1, 1) }, active && styles.activeCell]}
              onPress={() => commit({ h, s: hsv.s, v: hsv.v })}
              activeOpacity={0.8}
            />
          );
        })}
      </View>

      <Text style={styles.caption}>饱和度 / 明度</Text>
      <View style={styles.svGrid}>
        {valValues.map((v, row) => (
          <View key={row} style={styles.svRow}>
            {satValues.map((s, col) => {
              const c = hsvToHex(hsv.h, s, v);
              const light = isLightHex(c);
              const active = isSel(s, v);
              return (
                <TouchableOpacity
                  key={col}
                  style={[styles.svCell, { backgroundColor: c }, active && styles.activeCell]}
                  onPress={() => commit({ h: hsv.h, s, v })}
                  activeOpacity={0.8}
                >
                  {active && <Text style={[styles.check, { color: light ? '#000' : '#fff' }]}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.hexRow}>
        <View style={[styles.preview, { backgroundColor: hsvToHex(hsv.h, hsv.s, hsv.v) }]} />
        <TextInput
          style={styles.hexInput}
          placeholder="#FF0000"
          value={hexText}
          onChangeText={applyHexText}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 4 },
  caption: { fontSize: 12, color: '#888', marginBottom: 6, marginTop: 8 },
  hueRow: { flexDirection: 'row' },
  hueCell: { flex: 1, height: 26, marginHorizontal: 1, borderRadius: 4 },
  activeCell: { borderWidth: 2, borderColor: '#1E88E5' },
  svGrid: { flexDirection: 'column' },
  svRow: { flexDirection: 'row' },
  svCell: {
    flex: 1, aspectRatio: 1, margin: 1, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  check: { fontSize: 14, fontWeight: 'bold' },
  hexRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  preview: { width: 44, height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  hexInput: {
    flex: 1, marginLeft: 10, backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: '#eee',
  },
});
