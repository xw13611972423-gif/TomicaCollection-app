import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  ScrollView, Alert, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCarStore } from '../CarStore';
import { normalizeImageUri } from '../storage';
import { presetModels, presetColors, presetCurrencies, presetLocations, CUSTOM_MODEL_MARKER } from '../constants';
import ColorSwatch from '../components/ColorSwatch';
import ColorPicker from '../components/ColorPicker';

export default function AddEditScreen({ carId, onDone, onCancel }) {
  const { cars, addCar, updateCar } = useCarStore();
  const editingCar = carId ? cars.find((c) => c.id === carId) : null;

  const [modelName, setModelName] = useState(editingCar?.modelName || '');
  const [customModel, setCustomModel] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [colorName, setColorName] = useState(editingCar?.colorName || '');
  const [colorHex, setColorHex] = useState(editingCar?.colorHex || '#E53935');
  const [note, setNote] = useState(editingCar?.note || '');
  const [imageUri, setImageUri] = useState(editingCar?.imageUri || null);
  const [price, setPrice] = useState(editingCar?.price || '');
  const [currency, setCurrency] = useState(editingCar?.currency || '¥');
  const [purchaseLocation, setPurchaseLocation] = useState(editingCar?.purchaseLocation || '');

  // 若编辑的型号不在预置清单，走「自定义」输入
  useEffect(() => {
    if (editingCar && editingCar.modelName && !presetModels.includes(editingCar.modelName)) {
      setModelName(CUSTOM_MODEL_MARKER);
      setCustomModel(editingCar.modelName);
    }
  }, []);

  const finalModelName = modelName === CUSTOM_MODEL_MARKER ? customModel.trim() : modelName.trim();

  const shownModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase();
    if (!q) return presetModels;
    return presetModels.filter((m) => m.toLowerCase().includes(q));
  }, [modelSearch]);

  const pickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert('提示', '需要相机权限才能拍照'); return; }
    const r = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!r.canceled) {
      const uri = r.assets?.[0]?.uri ?? r.uri;
      if (uri) setImageUri(await normalizeImageUri(uri));
    }
  };

  const pickLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('提示', '需要相册权限才能选图'); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!r.canceled) {
      const uri = r.assets?.[0]?.uri ?? r.uri;
      if (uri) setImageUri(await normalizeImageUri(uri));
    }
  };

  const save = async () => {
    const model = finalModelName;
    if (!model) { Alert.alert('提示', '请选择或输入型号'); return; }
    const data = {
      modelName: model,
      colorName: colorName || '未指定',
      colorHex: colorHex || '#999999',
      note,
      imageUri,
      price: price.trim(),
      currency,
      purchaseLocation: purchaseLocation.trim(),
    };
    if (editingCar) await updateCar(editingCar.id, data);
    else await addCar(data);
    onDone();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}><Text style={styles.cancel}>取消</Text></TouchableOpacity>
        <Text style={styles.title}>{editingCar ? '编辑多美卡' : '添加多美卡'}</Text>
        <TouchableOpacity onPress={save}><Text style={styles.save}>保存</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {/* 照片 */}
        <Text style={styles.label}>照片</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={[styles.preview, styles.previewEmpty]}>
            <Text style={{ fontSize: 44 }}>🚗</Text>
          </View>
        )}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.photoBtn} onPress={pickCamera}>
            <Text style={styles.photoBtnText}>📷 拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoBtn} onPress={pickLibrary}>
            <Text style={styles.photoBtnText}>🖼 相册</Text>
          </TouchableOpacity>
          {imageUri ? (
            <TouchableOpacity style={[styles.photoBtn, styles.photoBtnDanger]} onPress={() => setImageUri(null)}>
              <Text style={styles.photoBtnTextDanger}>移除</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 型号 */}
        <Text style={styles.label}>型号</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索型号…"
          placeholderTextColor="#999"
          value={modelSearch}
          onChangeText={setModelSearch}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
          {shownModels.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modelChip, modelName === m && styles.modelChipActive]}
              onPress={() => setModelName(m)}
            >
              <Text style={[styles.modelChipText, modelName === m && styles.modelChipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.modelChip, modelName === CUSTOM_MODEL_MARKER && styles.modelChipActive]}
            onPress={() => setModelName(CUSTOM_MODEL_MARKER)}
          >
            <Text style={[styles.modelChipText, modelName === CUSTOM_MODEL_MARKER && styles.modelChipTextActive]}>
              {CUSTOM_MODEL_MARKER}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {shownModels.length === 0 && (
          <Text style={styles.hint}>预置清单里没有「{modelSearch.trim()}」，可选「{CUSTOM_MODEL_MARKER}」手动输入</Text>
        )}
        {modelName === CUSTOM_MODEL_MARKER && (
          <TextInput
            style={styles.input}
            placeholder="输入型号，如：丰田 皇冠"
            value={customModel}
            onChangeText={setCustomModel}
          />
        )}

        {/* 价格 */}
        <Text style={styles.label}>价格</Text>
        <View style={styles.currencyRow}>
          {presetCurrencies.map((cur) => (
            <TouchableOpacity
              key={cur}
              style={[styles.curChip, currency === cur && styles.curChipActive]}
              onPress={() => setCurrency(cur)}
            >
              <Text style={[styles.curChipText, currency === cur && styles.curChipTextActive]}>{cur}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="金额，如：59.9"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        {/* 购买地 */}
        <Text style={styles.label}>购买地</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
          {presetLocations.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[styles.modelChip, purchaseLocation === loc && styles.modelChipActive]}
              onPress={() => setPurchaseLocation(loc)}
            >
              <Text style={[styles.modelChipText, purchaseLocation === loc && styles.modelChipTextActive]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="或输入购买地，如：大阪玩具店"
          value={purchaseLocation}
          onChangeText={setPurchaseLocation}
        />

        {/* 颜色 */}
        <Text style={styles.label}>颜色（快捷）</Text>
        <View style={styles.swatchWrap}>
          {presetColors.map((c) => (
            <ColorSwatch
              key={c.name}
              name={c.name}
              hex={c.hex}
              selected={colorHex === c.hex && colorName === c.name}
              onPress={() => { setColorName(c.name); setColorHex(c.hex); }}
            />
          ))}
        </View>

        <Text style={styles.label}>细节色盘</Text>
        <ColorPicker
          value={colorHex}
          onChange={(hex) => { setColorHex(hex); setColorName('自定义'); }}
        />

        {/* 备注 */}
        <Text style={styles.label}>备注（可选）</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="备注，如：特殊版本、入手故事等"
          value={note}
          onChangeText={setNote}
          multiline
        />
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
  title: { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },
  cancel: { fontSize: 15, color: '#888' },
  save: { fontSize: 15, color: '#1E88E5', fontWeight: '600' },
  body: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 },
  preview: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#eee' },
  previewEmpty: { alignItems: 'center', justifyContent: 'center' },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  photoBtn: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
  },
  photoBtnDanger: { borderColor: '#E53935' },
  photoBtnText: { fontSize: 14, color: '#333' },
  photoBtnTextDanger: { fontSize: 14, color: '#E53935' },
  searchInput: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 14, marginBottom: 8, borderWidth: 1, borderColor: '#eee',
  },
  hint: { fontSize: 12, color: '#E53935', marginBottom: 8 },
  modelChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    backgroundColor: '#fff', marginRight: 8,
  },
  modelChipActive: { backgroundColor: '#1E88E5' },
  modelChipText: { fontSize: 13, color: '#444' },
  modelChipTextActive: { color: '#fff', fontWeight: '600' },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  curChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 16,
    backgroundColor: '#fff', marginRight: 8, marginBottom: 4,
    borderWidth: 1, borderColor: '#ddd',
  },
  curChipActive: { backgroundColor: '#1E88E5', borderColor: '#1E88E5' },
  curChipText: { fontSize: 14, color: '#444' },
  curChipTextActive: { color: '#fff', fontWeight: '600' },
  swatchWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  input: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: '#eee',
  },
  noteInput: { minHeight: 64, textAlignVertical: 'top' },
});
