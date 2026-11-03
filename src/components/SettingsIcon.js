import React from 'react';
import { View, StyleSheet } from 'react-native';

// 设置图标（滑块图标，非 emoji，颜色随主题）
export default function SettingsIcon({ color, size = 20 }) {
  const knobOffsets = [11, 3, 7];
  return (
    <View style={{ width: size, height: size, justifyContent: 'space-evenly' }}>
      {knobOffsets.map((left, i) => (
        <View key={i} style={styles.line}>
          <View style={[styles.lineBody, { backgroundColor: color }]} />
          <View style={[styles.knob, { left, backgroundColor: color }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: { height: 8, justifyContent: 'center' },
  lineBody: { height: 2.2, borderRadius: 1.1, width: '100%' },
  knob: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
});
