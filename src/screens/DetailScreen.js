import React from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, Alert, StyleSheet, useWindowDimensions,
} from 'react-native';
import { useCarStore } from '../CarStore';
import { useSettings } from '../SettingsStore';
import { glassSurface } from '../theme';

function TrashIcon({ color }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 15, height: 3, borderRadius: 2, backgroundColor: color, marginBottom: 1.5 }} />
      <View style={{ width: 18, height: 15, borderRadius: 3.5, borderWidth: 1.8, borderColor: color, borderTopWidth: 0 }} />
    </View>
  );
}

export default function DetailScreen({ carId, onBack, onEdit, onDeleted }) {
  const { cars, deleteCar } = useCarStore();
  const { theme, glass } = useSettings();
  const { width } = useWindowDimensions();
  const wide = width >= 700;
  const car = cars.find((c) => c.id === carId);
  const s = createStyles(theme, glass);

  if (!car) {
    return (
      <View style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: theme.text3 }}>该收藏已被删除</Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 12 }}>
          <Text style={{ color: theme.accent }}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const confirmDelete = () => {
    Alert.alert('删除', '确定删除这辆多美卡？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => { deleteCar(car.id); onDeleted(); },
      },
    ]);
  };

  const headerStyle = glass
    ? { backgroundColor: theme.glassStrong, borderBottomColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderBottomColor: theme.border };
  const delStyle = glass
    ? { backgroundColor: theme.dangerSoft, borderWidth: 1, borderColor: theme.danger }
    : { backgroundColor: theme.danger };
  const trashColor = glass ? theme.danger : '#fff';

  const image = car.imageUri ? (
    <Image
      source={{ uri: car.imageUri }}
      style={[s.image, wide && s.imageWide]}
      resizeMode="contain"
    />
  ) : (
    <View style={[s.image, wide && s.imageWide, s.imageEmpty]}>
      <Text style={{ fontSize: 70 }}>🚗</Text>
    </View>
  );

  const info = (
    <View style={[s.infoCard, glassSurface(theme, glass, 18, true), wide && s.infoCardWide]}>
      <View style={s.modelRow}>
        <Text style={s.modelName}>{car.modelName}</Text>
        {car.modelNumber ? <Text style={s.number}>No. {car.modelNumber}</Text> : null}
      </View>
      <View style={s.colorRow}>
        <View style={[s.dot, { backgroundColor: car.colorHex || '#999' }]} />
        <Text style={s.colorName}>{car.colorName}</Text>
      </View>
      {car.price ? <Text style={s.meta}>价格：{car.currency}{car.price}</Text> : null}
      {car.purchaseLocation ? <Text style={s.meta}>购买地：{car.purchaseLocation}</Text> : null}
      {car.note ? <Text style={s.note}>备注：{car.note}</Text> : null}
      <Text style={s.date}>
        收藏时间：{new Date(car.dateAdded).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={[s.header, headerStyle]}>
        <TouchableOpacity onPress={onBack}><Text style={s.back}>‹ 返回</Text></TouchableOpacity>
        <Text style={s.title} numberOfLines={1}>{car.modelName}</Text>
        <View style={s.headerActions}>
          <TouchableOpacity onPress={() => onEdit(car.id)}>
            <Text style={s.edit}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmDelete}
            style={[s.delBtn, delStyle]}
            activeOpacity={0.8}
          >
            <TrashIcon color={trashColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        {wide ? (
          <View style={s.wideRow}>
            {image}
            {info}
          </View>
        ) : (
          <>
            {image}
            {info}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(theme, glass) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: { fontSize: 17, fontWeight: '600', color: theme.text, flex: 1, textAlign: 'center', marginHorizontal: 8 },
    back: { fontSize: 15, color: theme.accent },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    edit: { fontSize: 15, color: theme.accent, fontWeight: '600' },
    delBtn: {
      marginLeft: 14, width: 36, height: 36, borderRadius: 18,
      alignItems: 'center', justifyContent: 'center',
    },
    body: { padding: 16, paddingBottom: 40 },
    wideRow: { flexDirection: 'row', alignItems: 'flex-start' },
    image: { width: '100%', height: 300, borderRadius: 18, backgroundColor: theme.chip },
    imageWide: { flex: 1, height: 340 },
    imageEmpty: { alignItems: 'center', justifyContent: 'center' },
    infoCard: { padding: 16, marginTop: 16, borderWidth: 1, borderColor: theme.border },
    infoCardWide: { flex: 1, marginTop: 0, marginLeft: 16 },
    modelRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    modelName: { fontSize: 20, fontWeight: '700', color: theme.text },
    number: {
      marginLeft: 10, fontSize: 13, color: theme.accent, fontWeight: '600',
      backgroundColor: theme.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
    },
    colorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    dot: { width: 16, height: 16, borderRadius: 8, marginRight: 8 },
    colorName: { fontSize: 16, color: theme.text2 },
    meta: { fontSize: 15, color: theme.text2, marginTop: 10 },
    note: { fontSize: 14, color: theme.text2, marginTop: 12, lineHeight: 20 },
    date: { fontSize: 12, color: theme.text3, marginTop: 16 },
  });
}
