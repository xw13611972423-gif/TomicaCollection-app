import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  ScrollView, Alert, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCarStore } from '../CarStore';
import { presetModels, presetColors, CUSTOM_MODEL_MARKER } from '../constants';
import ColorSwatch from '../components/ColorSwatch';

export default function AddEditScreen({ carId, onDone, onCancel }) {
  const { cars, addCar, updateCar } = useCarStore();
  const editingCar = carId ? cars.find((c) => c.id === carId) : null;

  const [modelName, setModelName] = useState(editingCar?.modelName || '');
  const [customModel, setCustomModel] = useState('');
  const [colorName, setColorName] = useState(editingCar?.colorName || '');
  const [colorHex, setColorHex] = useState(editingCar?.colorHex || '#E53935');
  const [customHex, setCustomHex] = useState('');
  const [note, setNote] = useState(editingCar?.note || '');
  const [imageUri, setImageUri] = useState(editingCar?.imageUri || null);

  // 若编辑的型号不在预置清单，走「自定义」输入
  useEffect(() => {
    if (editingCar && editingCar.modelName && !presetModels.includes(editingCar.modelName)) {
      setModelName(CUSTOM_MODEL_MARKER);
      setCustomModel(editingCar.modelName);
    }
  }, []);

  const finalModelName = modelName === CUSTOM_MODEL_MARKER ? customModel.trim() : modelName.trim();

  const pickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert('提示', '需要相机权限才能拍照'); return; }
    const r = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!r.canceled) {
      const uri = r.assets?.[0]?.uri ?? r.uri;
      if (uri) setImageUri(uri);
    }
  };

  const pickLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('提示', '需要相册权限才能选图'); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!r.canceled) {
      const uri = r.assets?.[0]?.uri ?? r.uri;
      if (uri) setImageUri(uri);
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
          {presetModels.map((m) => (
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
        {modelName === CUSTOM_MODEL_MARKER && (
          <TextInput
            style={styles.input}
            placeholder="输入型号，如：丰田 皇冠"
            value={customModel}
            onChangeText={setCustomModel}
          />
        )}

        {/* 颜色 */}
        <Text style={styles.label}>颜色</Text>
        <View style={styles.swatchWrap}>
          {presetColors.map((c) => (
            <ColorSwatch
              key={c.name}
              name={c.name}
              hex={c.hex}
              selected={colorHex === c.hex && colorName === c.name}
              onPress={() => { setColorName(c.name); setColorHex(c.hex); setCustomHex(''); }}
            />
          ))}
        </View>

        <Text style={styles.label}>自定义颜色（十六进制）</Text>
        <View style={styles.hexRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="#FF0000"
            value={customHex}
            onChangeText={(t) => {
              setCustomHex(t);
              const h = t.startsWith('#') ? t : '#' + t;
              if (/^#[0-9A-Fa-f]{6}$/.test(h)) {
                setColorHex(h);
                setColorName('自定义');
              }
            }}
          />
          <View
            style={[
              styles.hexPreview,
              { backgroundColor: /^#?[0-9A-Fa-f]{6}$/.test(customHex) ? (customHex.startsWith('#') ? customHex : '#' + customHex) : '#ccc' },
            ]}
          />
        </View>

        {/* 备注 */}
        <Text style={styles.label}>备注（可选）</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="备注，如：购入价格、来源等"
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
  modelChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    backgroundColor: '#fff', marginRight: 8,
  },
  modelChipActive: { backgroundColor: '#1E88E5' },
  modelChipText: { fontSize: 13, color: '#444' },
  modelChipTextActive: { color: '#fff', fontWeight: '600' },
  swatchWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  hexRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: '#eee',
  },
  noteInput: { minHeight: 64, textAlignVertical: 'top' },
  hexPreview: { width: 40, height: 40, borderRadius: 8, marginLeft: 10, borderWidth: 1, borderColor: '#ddd' },
});
