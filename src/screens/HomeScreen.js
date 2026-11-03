import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  ScrollView, StyleSheet, useWindowDimensions,
} from 'react-native';
import { useCarStore } from '../CarStore';
import { useSettings } from '../SettingsStore';
import { presetModels, presetColors } from '../constants';
import CarCard from '../components/CarCard';

export default function HomeScreen({ onAdd, onOpen, onSettings }) {
  const { cars } = useCarStore();
  const { theme, glass } = useSettings();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 5 : width >= 768 ? 4 : width >= 600 ? 3 : 2;
  const s = createStyles(theme);

  const [search, setSearch] = useState('');
  const [filterModel, setFilterModel] = useState(null);
  const [filterColor, setFilterColor] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (filterModel && c.modelName !== filterModel) return false;
      if (filterColor && c.colorName !== filterColor) return false;
      if (search) {
        const q = search.trim().toLowerCase();
        const hay =
          `${c.modelName} ${c.modelNumber} ${c.colorName} ${c.note} ${c.price} ${c.currency} ${c.purchaseLocation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cars, filterModel, filterColor, search]);

  const hasFilter = !!(filterModel || filterColor || search);

  const headerStyle = glass
    ? { backgroundColor: theme.glass, borderBottomColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderBottomColor: theme.border };
  const panelStyle = glass
    ? { backgroundColor: theme.glass, borderColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderColor: theme.border };

  return (
    <View style={s.container}>
      {/* 顶栏 */}
      <View style={[s.header, headerStyle]}>
        <TouchableOpacity style={s.gearBtn} onPress={onSettings} activeOpacity={0.7}>
          <Text style={s.gear}>⚙</Text>
        </TouchableOpacity>
        <Text style={s.title}>我的多美卡</Text>
        <TouchableOpacity style={s.addBtn} onPress={onAdd} activeOpacity={0.8}>
          <Text style={s.addBtnText}>＋ 添加</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索 */}
      <TextInput
        style={s.search}
        placeholder="搜索型号 / 编号 / 颜色 / 备注"
        placeholderTextColor={theme.placeholder}
        value={search}
        onChangeText={setSearch}
      />

      {/* 筛选按钮 */}
      <View style={s.filterRow}>
        <TouchableOpacity
          style={[s.filterBtn, hasFilter && s.filterBtnActive]}
          onPress={() => setShowFilter((v) => !v)}
        >
          <Text style={[s.filterBtnText, hasFilter && s.filterBtnTextActive]}>
            {hasFilter ? '筛选 ✓' : '筛选'}
          </Text>
        </TouchableOpacity>
        {filterModel ? (
          <Text style={s.activeChip} onPress={() => setFilterModel(null)}>{filterModel} ✕</Text>
        ) : null}
        {filterColor ? (
          <Text style={s.activeChip} onPress={() => setFilterColor(null)}>{filterColor} ✕</Text>
        ) : null}
      </View>

      {/* 筛选面板 */}
      {showFilter && (
        <View style={[s.filterPanel, panelStyle]}>
          <Text style={s.filterLabel}>按型号</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
            <Chip theme={theme} label="全部" active={!filterModel} onPress={() => setFilterModel(null)} />
            {presetModels.map((m) => (
              <Chip key={m.name} theme={theme} label={m.name} active={filterModel === m.name} onPress={() => setFilterModel(m.name)} />
            ))}
          </ScrollView>
          <Text style={s.filterLabel}>按颜色</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip theme={theme} label="全部" active={!filterColor} onPress={() => setFilterColor(null)} />
            {presetColors.map((c) => (
              <Chip
                key={c.name}
                theme={theme}
                label={c.name}
                dot={c.hex}
                active={filterColor === c.name}
                onPress={() => setFilterColor(c.name)}
              />
            ))}
          </ScrollView>
          {hasFilter && (
            <TouchableOpacity
              onPress={() => { setFilterModel(null); setFilterColor(null); setSearch(''); }}
            >
              <Text style={s.clearText}>清除全部筛选</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 列表 */}
      {cars.length === 0 ? (
        <View style={s.emptyWrap}>
          <Text style={s.emptyIcon}>🚗</Text>
          <Text style={s.emptyTitle}>还没有收藏</Text>
          <Text style={s.emptySub}>点右上角「添加」拍下你的第一辆多美卡</Text>
        </View>
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

function Chip({ theme, label, active, onPress, dot }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: theme.chip },
        active && { backgroundColor: theme.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {dot ? <View style={[styles.chipDot, { backgroundColor: dot }]} /> : null}
      <Text style={[styles.chipText, { color: active ? '#fff' : theme.chipText }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    gearBtn: {
      width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.chip,
    },
    gear: { fontSize: 18, color: theme.text2 },
    title: { flex: 1, fontSize: 22, fontWeight: '700', color: theme.text, marginLeft: 12 },
    addBtn: { backgroundColor: theme.accent, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22 },
    addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
    search: {
      marginHorizontal: 16, marginTop: 10, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 10,
      backgroundColor: theme.card, borderRadius: 14, fontSize: 14, color: theme.text,
      borderWidth: 1, borderColor: theme.border,
    },
    filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 6 },
    filterBtn: {
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
      backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
    },
    filterBtnActive: { backgroundColor: theme.accentSoft, borderColor: theme.accent },
    filterBtnText: { fontSize: 13, color: theme.text2 },
    filterBtnTextActive: { color: theme.accent, fontWeight: '600' },
    activeChip: {
      marginLeft: 8, fontSize: 13, color: theme.accent, backgroundColor: theme.accentSoft,
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14,
    },
    filterPanel: {
      marginHorizontal: 16, marginBottom: 8, padding: 14,
      borderRadius: 18, borderWidth: 1,
    },
    filterLabel: { fontSize: 13, fontWeight: '600', color: theme.text2, marginBottom: 4 },
    clearText: { marginTop: 8, color: theme.danger, fontSize: 13 },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyIcon: { fontSize: 60, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: theme.text },
    emptySub: { fontSize: 14, color: theme.text3, marginTop: 6, textAlign: 'center' },
  });
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 18, marginRight: 8,
  },
  chipText: { fontSize: 13 },
  chipDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
});
