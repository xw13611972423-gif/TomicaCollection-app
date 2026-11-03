import React from 'react';
import {
  View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet,
} from 'react-native';
import { useSettings } from '../SettingsStore';

export default function SettingsScreen({ onBack }) {
  const { mode, setMode, glass, setGlass, theme } = useSettings();
  const s = createStyles(theme);

  const modes = [
    { key: 'system', label: '跟随系统' },
    { key: 'light', label: '浅色' },
    { key: 'dark', label: '深色' },
  ];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack}><Text style={s.back}>‹ 返回</Text></TouchableOpacity>
        <Text style={s.title}>设置</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.body}>
        <Text style={s.section}>外观</Text>
        <View style={s.card}>
          <View style={s.segRow}>
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
        <View style={s.card}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>液态玻璃</Text>
              <Text style={s.rowSub}>卡片与顶栏的半透明质感</Text>
            </View>
            <Switch
              value={glass}
              onValueChange={setGlass}
              trackColor={{ true: theme.accent, false: theme.border }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={s.about}>多美卡收藏 · v1.1</Text>
      </ScrollView>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.card,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border,
    },
    title: { fontSize: 17, fontWeight: '600', color: theme.text },
    back: { fontSize: 15, color: theme.accent },
    headerSpacer: { width: 48 },
    body: { padding: 16, paddingBottom: 40 },
    section: { fontSize: 13, fontWeight: '600', color: theme.text3, marginTop: 8, marginBottom: 8, marginLeft: 4 },
    card: { backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 8 },
    segRow: { flexDirection: 'row', backgroundColor: theme.chip, borderRadius: 12, padding: 3 },
    seg: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
    segActive: { backgroundColor: theme.card },
    segText: { fontSize: 14, color: theme.chipText },
    segTextActive: { color: theme.text, fontWeight: '600' },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowTitle: { fontSize: 15, color: theme.text, fontWeight: '500' },
    rowSub: { fontSize: 12, color: theme.text3, marginTop: 3 },
    about: { textAlign: 'center', color: theme.text3, fontSize: 12, marginTop: 24 },
  });
}
