import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Image,
  ScrollView, StyleSheet, useWindowDimensions,
} from 'react-native';
import { useCarStore } from '../CarStore';
import { useSettings } from '../SettingsStore';
import { glassSurface } from '../theme';
import { presetColors } from '../constants';
import CarCard from '../components/CarCard';
import SettingsIcon from '../components/SettingsIcon';
import FadeIn from '../components/FadeIn';

export default function HomeScreen({ onAdd, onOpen, onSettings }) {
  const { cars } = useCarStore();
  const { theme, glass, emptyImageUri } = useSettings();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 5 : width >= 768 ? 4 : width >= 600 ? 3 : 2;
  const s = createStyles(theme, glass);

  const [search, setSearch] = useState('');
  const [filterColor, setFilterColor] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (filterColor && c.colorName !== filterColor) return false;
      if (search) {
        const q = search.trim().toLowerCase();
        const hay =
          `${c.modelName} ${c.modelNumber} ${c.colorName} ${c.note} ${c.price} ${c.currency} ${c.purchaseLocation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cars, filterColor, search]);

  const hasFilter = !!(filterColor || search);

  const headerStyle = glass
    ? { backgroundColor: theme.glassStrong, borderBottomColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderBottomColor: theme.border };

  return (
    <View style={s.container}>
      {/* 顶栏 */}
      <View style={[s.header, headerStyle]}>
        <TouchableOpacity style={[s.gearBtn, glassSurface(theme, glass, 17)]} onPress={onSettings} activeOpacity={0.7}>
          <SettingsIcon color={theme.text2} size={18} />
        </TouchableOpacity>
        <Text style={s.title}>我的多美卡</Text>
        <TouchableOpacity style={[s.addBtn, glass && { backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.accent }]} onPress={onAdd} activeOpacity={0.8}>
          <Text style={[s.addBtnText, glass && { color: theme.accent }]}>＋ 添加</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索 */}
      <TextInput
        style={[s.search, glassSurface(theme, glass, 14)]}
        placeholder="搜索型号 / 编号 / 颜色 / 备注"
        placeholderTextColor={theme.placeholder}
        value={search}
        onChangeText={setSearch}
      />

      {/* 筛选按钮 */}
      <View style={s.filterRow}>
        <TouchableOpacity
          style={[s.filterBtn, glassSurface(theme, glass, 20), hasFilter && { borderColor: theme.accent }]}
          onPress={() => setShowFilter((v) => !v)}
        >
          <Text style={[s.filterBtnText, hasFilter && s.filterBtnTextActive]}>
            {hasFilter ? '筛选 ✓' : '筛选'}
          </Text>
        </TouchableOpacity>
        {filterColor ? (
          <Text style={s.activeChip} onPress={() => setFilterColor(null)}>{filterColor} ✕</Text>
        ) : null}
      </View>

      {/* 筛选面板（仅按颜色） */}
      {showFilter && (
        <View style={[s.filterPanel, glassSurface(theme, glass, 18, true)]}>
          <Text style={s.filterLabel}>按颜色</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip theme={theme} glass={glass} label="全部" active={!filterColor} onPress={() => setFilterColor(null)} />
            {presetColors.map((c) => (
              <Chip
                key={c.name}
                theme={theme}
                glass={glass}
                label={c.name}
                dot={c.hex}
                active={filterColor === c.name}
                onPress={() => setFilterColor(c.name)}
              />
            ))}
          </ScrollView>
          {hasFilter && (
            <TouchableOpacity onPress={() => { setFilterColor(null); setSearch(''); }}>
              <Text style={s.clearText}>清除筛选</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 列表 / 空状态 */}
      {cars.length === 0 ? (
        <FadeIn style={s.emptyWrap}>
          {emptyImageUri ? (
            <Image source={{ uri: emptyImageUri }} style={s.emptyImage} resizeMode="contain" />
          ) : (
            <Text style={s.emptyIcon}>🚗</Text>
          )}
          <Text style={s.emptyTitle}>还没有收藏</Text>
          <Text style={s.emptySub}>点右上角「添加」拍下你的第一辆多美卡</Text>
        </FadeIn>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={{ flex: 1 }}
          renderItem={({ item }) => <CarCard car={item} onPress={() => onOpen(item.id)} />}
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <Text style={s.emptySub}>没有符合条件的结果</Text>
            </View>
          }
          contentContainerStyle={{ padding: 6, flexGrow: 1 }}
        />
      )}
    </View>
  );
}

function Chip({ theme, glass, label, active, onPress, dot }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        glassSurface(theme, glass, 18),
        active && { backgroundColor: theme.accent, borderColor: theme.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {dot ? <View style={[styles.chipDot, { backgroundColor: dot }]} /> : null}
      <Text style={[styles.chipText, { color: active ? '#fff' : theme.chipText }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function createStyles(theme, glass) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: glass ? 'transparent' : theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    gearBtn: {
      width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
    },
    title: { flex: 1, fontSize: 22, fontWeight: '700', color: theme.text, marginLeft: 12 },
    addBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, backgroundColor: theme.accent },
    addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
    search: {
      marginHorizontal: 16, marginTop: 10, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 10,
      fontSize: 14, color: theme.text,
    },
    filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 6 },
    filterBtn: { paddingHorizontal: 16, paddingVertical: 8 },
    filterBtnText: { fontSize: 13, color: theme.text2 },
    filterBtnTextActive: { color: theme.accent, fontWeight: '600' },
    activeChip: {
      marginLeft: 8, fontSize: 13, color: theme.accent, backgroundColor: theme.accentSoft,
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14,
    },
    filterPanel: { marginHorizontal: 16, marginBottom: 8, padding: 14 },
    filterLabel: { fontSize: 13, fontWeight: '600', color: theme.text2, marginBottom: 4 },
    clearText: { marginTop: 8, color: theme.danger, fontSize: 13 },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyIcon: { fontSize: 60, marginBottom: 12 },
    emptyImage: { width: 140, height: 140, marginBottom: 12, borderRadius: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: theme.text },
    emptySub: { fontSize: 14, color: theme.text3, marginTop: 6, textAlign: 'center' },
  });
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    marginRight: 8,
  },
  chipText: { fontSize: 13 },
  chipDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
});
