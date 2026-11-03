import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useSettings } from '../SettingsStore';
import { glassSurface } from '../theme';
import { rotateImage, flipHorizontal, flipVertical, cropSquare } from '../imageEdit';

// 图片编辑工具条：旋转 / 左右翻转 / 上下翻转 / 裁成方形
export default function ImageEditBar({ uri, onChange }) {
  const { theme, glass } = useSettings();

  const act = async (fn) => {
    try {
      const nu = await fn(uri);
      if (nu) onChange(nu);
    } catch (e) {
      Alert.alert('提示', '图片处理失败');
    }
  };

  const items = [
    { label: '↻ 旋转', fn: () => rotateImage(uri) },
    { label: '⇋ 左右', fn: () => flipHorizontal(uri) },
    { label: '⇵ 上下', fn: () => flipVertical(uri) },
    { label: '▢ 裁方', fn: () => cropSquare(uri) },
  ];

  return (
    <View style={styles.row}>
      {items.map((it) => (
        <TouchableOpacity
          key={it.label}
          style={[styles.btn, glassSurface(theme, glass, 16)]}
          onPress={() => act(it.fn)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, { color: theme.text2 }]}>{it.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 7 },
  label: { fontSize: 13 },
});
