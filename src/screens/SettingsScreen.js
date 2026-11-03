import React from 'react';
import {
  View, Text, Image, TouchableOpacity, Switch, ScrollView, Alert, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSettings } from '../SettingsStore';
import { glassSurface } from '../theme';
import { normalizeImageUri, saveImageToDocuments, deleteImageFile } from '../storage';
import ImageEditBar from '../components/ImageEditBar';

export default function SettingsScreen({ onBack }) {
  const { mode, setMode, glass, setGlass, emptyImageUri, setEmptyImageUri, theme } = useSettings();
  const s = createStyles(theme, glass);

  const modes = [
    { key: 'system', label: '跟随系统' },
    { key: 'light', label: '浅色' },
    { key: 'dark', label: '深色' },
  ];

  const pickEmptyImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('提示', '需要相册权限才能选图'); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!r.canceled) {
      const uri = r.assets?.[0]?.uri ?? r.uri;
      if (uri) {
        const norm = await normalizeImageUri(uri);
        const saved = await saveImageToDocuments(norm);
        setEmptyImageUri(saved);
      }
    }
  };

  const clearEmptyImage = () => {
    if (emptyImageUri) deleteImageFile(emptyImageUri);
    setEmptyImageUri(null);
  };

  const headerStyle = glass
    ? { backgroundColor: theme.glassStrong, borderBottomColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderBottomColor: theme.border };

  return (
    <View style={s.container}>
      <View style={[s.header, headerStyle]}>
        <TouchableOpacity onPress={onBack}><Text style={s.back}>‹ 返回</Text></TouchableOpacity>
        <Text style={s.title}>设置</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.body}>
        <Text style={s.section}>外观</Text>
        <View style={[s.card, glassSurface(theme, glass, 16, true)]}>
          <View style={[s.segRow, glassSurface(theme, glass, 12)]}>
            {modes.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[s.seg, mode === m.key && s.segActive]}
                onPress={() => setMode(m.key)}
                activeOpacity={0.8}
              >
                <Text style={[s.segText, mode === m.key && s.segTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={s.section}>效果</Text>
        <View style={[s.card, glassSurface(theme, glass, 16, true)]}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>液态玻璃</Text>
              <Text style={s.rowSub}>开启后卡片呈半透明磨砂质感</Text>
            </View>
            <Switch
              value={glass}
              onValueChange={setGlass}
              trackColor={{ true: theme.accent, false: theme.border }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={s.section}>空状态图片</Text>
        <View style={[s.card, glassSurface(theme, glass, 16, true)]}>
          {emptyImageUri ? (
            <Image source={{ uri: emptyImageUri }} style={s.emptyPreview} resizeMode="contain" />
          ) : (
            <View style={[s.emptyPreview, s.emptyPreviewPlaceholder]}>
              <Text style={{ fontSize: 40 }}>🚗</Text>
            </View>
          )}
          <View style={[s.row, { marginTop: 10 }]}>
            <TouchableOpacity style={[s.photoBtn, glassSurface(theme, glass, 20)]} onPress={pickEmptyImage}>
              <Text style={s.photoBtnText}>选择图片</Text>
            </TouchableOpacity>
            {emptyImageUri ? (
              <TouchableOpacity style={[s.photoBtn, glassSurface(theme, glass, 20), { borderColor: theme.danger, marginLeft: 10 }]} onPress={clearEmptyImage}>
                <Text style={[s.photoBtnText, { color: theme.danger }]}>清除</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {emptyImageUri ? (
            <ImageEditBar uri={emptyImageUri} onChange={(u) => setEmptyImageUri(u)} />
          ) : null}
        </View>

        <Text style={s.about}>多美卡收藏 · v2.1.0beta</Text>
      </ScrollView>
    </View>
  );
}

function createStyles(theme, glass) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: glass ? 'transparent' : theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: { fontSize: 17, fontWeight: '600', color: theme.text },
    back: { fontSize: 15, color: theme.accent },
    headerSpacer: { width: 48 },
    body: { padding: 16, paddingBottom: 40 },
    section: { fontSize: 13, fontWeight: '600', color: theme.text3, marginTop: 8, marginBottom: 8, marginLeft: 4 },
    card: { padding: 16, marginBottom: 8, borderWidth: 1, borderColor: theme.border },
    segRow: { flexDirection: 'row', padding: 3 },
    seg: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
    segActive: { backgroundColor: theme.card },
    segText: { fontSize: 14, color: theme.chipText },
    segTextActive: { color: theme.text, fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowTitle: { fontSize: 15, color: theme.text, fontWeight: '500' },
    rowSub: { fontSize: 12, color: theme.text3, marginTop: 3 },
    emptyPreview: { width: '100%', height: 160, borderRadius: 14, backgroundColor: theme.chip },
    emptyPreviewPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    photoBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: 'transparent' },
    photoBtnText: { fontSize: 14, color: theme.text },
    about: { textAlign: 'center', color: theme.text3, fontSize: 12, marginTop: 24 },
  });
}
