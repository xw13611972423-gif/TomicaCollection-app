import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { useCarStore } from '../CarStore';
import { presetModels, presetColors } from '../constants';
import CarCard from '../components/CarCard';

export default function HomeScreen({ onAdd, onOpen }) {
  const { cars } = useCarStore();
  const [search, setSearch] = useState('');
  const [filterModel, setFilterModel] = useState(null);
  const [filterColor, setFilterColor] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (filterModel && c.modelName !== filterModel) return false;
      if (filterColor && c.colorName !== filterColor) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${c.modelName} ${c.colorName} ${c.note}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cars, filterModel, filterColor, search]);

  const hasFilter = !!(filterModel || filterColor || search);

  return (
    <View style={styles.container}>
      {/* 顶栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>我的多美卡</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>＋ 添加</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索 */}
      <TextInput
        style={styles.search}
        placeholder="搜索型号 / 颜色 / 备注"
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {/* 筛选按钮 */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, hasFilter && styles.filterBtnActive]}
          onPress={() => setShowFilter((v) => !v)}
        >
          <Text style={[styles.filterBtnText, hasFilter && styles.filterBtnTextActive]}>
            {hasFilter ? '筛选 ✓' : '筛选'}
          </Text>
        </TouchableOpacity>
        {filterModel ? (
          <Text style={styles.activeChip} onPress={() => setFilterModel(null)}>{filterModel} ✕</Text>
        ) : null}
        {filterColor ? (
          <Text style={styles.activeChip} onPress={() => setFilterColor(null)}>{filterColor} ✕</Text>
        ) : null}
      </View>

      {/* 筛选面板 */}
      {showFilter && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>按型号</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
            <Chip label="全部" active={!filterModel} onPress={() => setFilterModel(null)} />
            {presetModels.map((m) => (
              <Chip key={m} label={m} active={filterModel === m} onPress={() => setFilterModel(m)} />
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>按颜色</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip label="全部" active={!filterColor} onPress={() => setFilterColor(null)} />
            {presetColors.map((c) => (
              <Chip
                key={c.name}
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
              <Text style={styles.clearText}>清除全部筛选</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 列表 */}
      {cars.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyTitle}>还没有收藏</Text>
          <Text style={styles.emptySub}>点右上角「添加」拍下你的第一辆多美卡</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ flex: 1 }}
          renderItem={({ item }) => <CarCard car={item} onPress={() => onOpen(item.id)} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptySub}>没有符合条件的结果</Text>
            </View>
          }
          contentContainerStyle={{ padding: 6, flexGrow: 1 }}
        />
      )}
    </View>
  );
}

function Chip({ label, active, onPress, dot }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {dot ? <View style={[styles.chipDot, { backgroundColor: dot }]} /> : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  addBtn: { backgroundColor: '#1E88E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  search: {
    marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#fff', borderRadius: 10, fontSize: 14,
  },
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 6 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
  },
  filterBtnActive: { backgroundColor: '#E3F2FD', borderColor: '#1E88E5' },
  filterBtnText: { fontSize: 13, color: '#555' },
  filterBtnTextActive: { color: '#1E88E5', fontWeight: '600' },
  activeChip: { marginLeft: 8, fontSize: 13, color: '#1E88E5', backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  filterPanel: {
    marginHorizontal: 16, marginBottom: 8, padding: 12,
    backgroundColor: '#fff', borderRadius: 12,
  },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, backgroundColor: '#F0F0F0', marginRight: 8,
  },
  chipActive: { backgroundColor: '#1E88E5' },
  chipText: { fontSize: 13, color: '#444' },
  chipTextActive: { color: '#fff' },
  chipDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  clearText: { marginTop: 8, color: '#E53935', fontSize: 13 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 60, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  emptySub: { fontSize: 14, color: '#999', marginTop: 6, textAlign: 'center' },
});
