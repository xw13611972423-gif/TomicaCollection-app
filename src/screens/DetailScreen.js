import React from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, Alert, StyleSheet,
} from 'react-native';
import { useCarStore } from '../CarStore';

export default function DetailScreen({ carId, onBack, onEdit, onDeleted }) {
  const { cars, deleteCar } = useCarStore();
  const car = cars.find((c) => c.id === carId);

  if (!car) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#999' }}>该收藏已被删除</Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 12 }}>
          <Text style={{ color: '#1E88E5' }}>返回</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>‹ 返回</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{car.modelName}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => onEdit(car.id)}>
            <Text style={styles.edit}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} style={{ marginLeft: 14 }}>
            <Text style={styles.del}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {car.imageUri ? (
          <Image source={{ uri: car.imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.image, styles.imageEmpty]}>
            <Text style={{ fontSize: 70 }}>🚗</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.modelName}>{car.modelName}</Text>
          <View style={styles.colorRow}>
            <View style={[styles.dot, { backgroundColor: car.colorHex || '#999' }]} />
            <Text style={styles.colorName}>{car.colorName}</Text>
          </View>
          {car.note ? <Text style={styles.note}>备注：{car.note}</Text> : null}
          <Text style={styles.date}>
            收藏时间：{new Date(car.dateAdded).toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ddd',
  },
  title: { fontSize: 17, fontWeight: '600', color: '#1a1a1a', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  back: { fontSize: 15, color: '#1E88E5' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  edit: { fontSize: 15, color: '#1E88E5', fontWeight: '600' },
  del: { fontSize: 17 },
  body: { padding: 16, paddingBottom: 40 },
  image: { width: '100%', height: 300, borderRadius: 12, backgroundColor: '#eee' },
  imageEmpty: { alignItems: 'center', justifyContent: 'center' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16 },
  modelName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  colorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dot: { width: 16, height: 16, borderRadius: 8, marginRight: 8 },
  colorName: { fontSize: 16, color: '#444' },
  note: { fontSize: 14, color: '#555', marginTop: 12, lineHeight: 20 },
  date: { fontSize: 12, color: '#999', marginTop: 16 },
});
