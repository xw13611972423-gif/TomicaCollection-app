import React from 'react';
import { View, StyleSheet } from 'react-native';

// 液态玻璃开启时的背景装饰色块，让半透明卡片能透出颜色，开关效果明显
export default function GlassBackdrop({ theme }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.blob, { top: -90, right: -70, width: 240, height: 240, backgroundColor: theme.accent, opacity: 0.16 }]} />
      <View style={[styles.blob, { bottom: -110, left: -90, width: 280, height: 280, backgroundColor: '#EC407A', opacity: 0.10 }]} />
      <View style={[styles.blob, { top: '38%', left: '26%', width: 210, height: 210, backgroundColor: '#8E24AA', opacity: 0.09 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', borderRadius: 999 },
});
