import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  ScrollView, Alert, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCarStore } from '../CarStore';
import { useSettings } from '../SettingsStore';
import { glassSurface } from '../theme';
import { normalizeImageUri } from '../storage';
import { presetModels, presetColors, presetCurrencies, presetLocations, CUSTOM_MODEL_MARKER } from '../constants';
import ColorSwatch from '../components/ColorSwatch';
import ColorPicker from '../components/ColorPicker';
import ImageEditBar from '../components/ImageEditBar';

export default function AddEditScreen({ carId, onDone, onCancel }) {
  const { cars, addCar, updateCar, customModels, addCustomModel } = useCarStore();
  const { theme, glass } = useSettings();
  const s = createStyles(theme, glass);
  const editingCar = carId ? cars.find((c) => c.id === carId) : null;

  const [modelName, setModelName] = useState(editingCar?.modelName || '');
  const [modelNumber, setModelNumber] = useState(editingCar?.modelNumber || '');
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
    if (editingCar && editingCar.modelName && !presetModels.some((m) => m.name === editingCar.modelName)) {
      setModelName(CUSTOM_MODEL_MARKER);
      setCustomModel(editingCar.modelName);
    }
  }, []);

  const finalModelName = modelName === CUSTOM_MODEL_MARKER ? customModel.trim() : modelName.trim();
  const finalModelNumber = modelNumber.trim();

  // 合并自定义车型（排前面）与预置车型
  const allModels = useMemo(() => {
    return [
      ...customModels,
      ...presetModels.filter((p) => !customModels.some((c) => c.name === p.name)),
    ];
  }, [customModels]);

  const shownModels = useMemo(() => {
    const q = modelSearch.trim().toLowerCase();
    if (!q) return allModels;
    return allModels.filter(
      (m) => m.name.toLowerCase().includes(q) || (m.number && m.number.includes(q))
    );
  }, [allModels, modelSearch]);

  // 是否为自定义车型（不在预置清单里）
  const isCustom = (name) => !presetModels.some((p) => p.name === name);

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
    // 自定义车型自动记住，下次可直接选
    if (!presetModels.some((p) => p.name === model)) {
      addCustomModel({ name: model, number: finalModelNumber });
    }
    const data = {
      modelName: model,
      modelNumber: finalModelNumber,
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

  const headerStyle = glass
    ? { backgroundColor: theme.glassStrong, borderBottomColor: theme.glassBorder }
    : { backgroundColor: theme.card, borderBottomColor: theme.border };

  return (
    <View style={s.container}>
      <View style={[s.header, headerStyle]}>
        <TouchableOpacity onPress={onCancel}><Text style={s.cancel}>取消</Text></TouchableOpacity>
        <Text style={s.title}>{editingCar ? '编辑多美卡' : '添加多美卡'}</Text>
        <TouchableOpacity onPress={save}><Text style={s.save}>保存</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        {/* 照片 */}
        <Text style={s.label}>照片</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={s.preview} resizeMode="cover" />
        ) : (
          <View style={[s.preview, s.previewEmpty]}>
            <Text style={{ fontSize: 44 }}>🚗</Text>
          </View>
        )}
        <View style={s.btnRow}>
          <TouchableOpacity style={[s.photoBtn, glassSurface(theme, glass, 22)]} onPress={pickCamera}>
            <Text style={s.photoBtnText}>📷 拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.photoBtn, glassSurface(theme, glass, 22)]} onPress={pickLibrary}>
            <Text style={s.photoBtnText}>🖼 相册</Text>
          </TouchableOpacity>
          {imageUri ? (
            <TouchableOpacity
              style={[s.photoBtn, glassSurface(theme, glass, 22), { borderColor: theme.danger }]}
              onPress={() => setImageUri(null)}
            >
              <Text style={s.photoBtnTextDanger}>移除</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {imageUri ? (
          <ImageEditBar uri={imageUri} onChange={(u) => setImageUri(u)} />
        ) : null}

        {/* 型号 */}
        <Text style={s.label}>型号</Text>
        <TextInput
          style={s.searchInput}
          placeholder="搜索型号或编号…"
          placeholderTextColor={theme.placeholder}
          value={modelSearch}
          onChangeText={setModelSearch}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
          {shownModels.map((m) => (
            <TouchableOpacity
              key={m.name}
              style={[
                s.modelChip,
                glassSurface(theme, glass, 20),
                modelName === m.name && s.modelChipActive,
                isCustom(m.name) && s.customChip,
              ]}
              onPress={() => { setModelName(m.name); setModelNumber(m.number); }}
            >
              <Text style={[s.modelChipText, modelName === m.name && s.modelChipTextActive]}>{m.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[s.modelChip, glassSurface(theme, glass, 20), modelName === CUSTOM_MODEL_MARKER && s.modelChipActive]}
            onPress={() => setModelName(CUSTOM_MODEL_MARKER)}
          >
            <Text style={[s.modelChipText, modelName === CUSTOM_MODEL_MARKER && s.modelChipTextActive]}>
              {CUSTOM_MODEL_MARKER}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {shownModels.length === 0 && (
          <Text style={s.hint}>预置清单里没有「{modelSearch.trim()}」，可选「{CUSTOM_MODEL_MARKER}」手动输入</Text>
        )}
        {modelName === CUSTOM_MODEL_MARKER && (
          <TextInput
            style={s.input}
            placeholder="输入型号，如：丰田 皇冠"
            placeholderTextColor={theme.placeholder}
            value={customModel}
            onChangeText={setCustomModel}
          />
        )}

        {/* 编号 */}
        <Text style={s.label}>编号（包装盒两位）</Text>
        <TextInput
          style={s.input}
          placeholder="如：55"
          placeholderTextColor={theme.placeholder}
          keyboardType="number-pad"
          maxLength={3}
          value={modelNumber}
          onChangeText={setModelNumber}
        />

        {/* 价格 */}
        <Text style={s.label}>价格</Text>
        <View style={s.currencyRow}>
          {presetCurrencies.map((cur) => (
            <TouchableOpacity
              key={cur}
              style={[s.curChip, glassSurface(theme, glass, 18), currency === cur && s.curChipActive]}
              onPress={() => setCurrency(cur)}
            >
              <Text style={[s.curChipText, currency === cur && s.curChipTextActive]}>{cur}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={s.input}
          placeholder="金额，如：59.9"
          placeholderTextColor={theme.placeholder}
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        {/* 购买地 */}
        <Text style={s.label}>购买地</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
          {presetLocations.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[s.modelChip, glassSurface(theme, glass, 20), purchaseLocation === loc && s.modelChipActive]}
              onPress={() => setPurchaseLocation(loc)}
            >
              <Text style={[s.modelChipText, purchaseLocation === loc && s.modelChipTextActive]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={s.input}
          placeholder="或输入购买地，如：大阪玩具店"
          placeholderTextColor={theme.placeholder}
          value={purchaseLocation}
          onChangeText={setPurchaseLocation}
        />

        {/* 颜色 */}
        <Text style={s.label}>颜色（快捷）</Text>
        <View style={s.swatchWrap}>
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

        <Text style={s.label}>细节色盘</Text>
        <ColorPicker
          value={colorHex}
          onChange={(hex) => { setColorHex(hex); setColorName('自定义'); }}
        />

        {/* 备注 */}
        <Text style={s.label}>备注（可选）</Text>
        <TextInput
          style={[s.input, s.noteInput]}
          placeholder="备注，如：特殊版本、入手故事等"
          placeholderTextColor={theme.placeholder}
          value={note}
          onChangeText={setNote}
          multiline
        />
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
    cancel: { fontSize: 15, color: theme.text2 },
    save: { fontSize: 15, color: theme.accent, fontWeight: '600' },
    body: { padding: 16, paddingBottom: 40 },
    label: { fontSize: 14, fontWeight: '600', color: theme.text, marginTop: 16, marginBottom: 8 },
    preview: { width: '100%', height: 200, borderRadius: 18, backgroundColor: theme.chip },
    previewEmpty: { alignItems: 'center', justifyContent: 'center' },
    btnRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
    photoBtn: {
      paddingHorizontal: 16, paddingVertical: 9,
    },
    photoBtnText: { fontSize: 14, color: theme.text },
    photoBtnTextDanger: { fontSize: 14, color: theme.danger },
    searchInput: {
      backgroundColor: theme.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9,
      fontSize: 14, marginBottom: 8, borderWidth: 1, borderColor: theme.border, color: theme.text,
    },
    hint: { fontSize: 12, color: theme.danger, marginBottom: 8 },
    modelChip: {
      paddingHorizontal: 14, paddingVertical: 8,
      marginRight: 8,
    },
    modelChipActive: { backgroundColor: theme.accent, borderColor: theme.accent },
    customChip: { borderColor: theme.accent },
    modelChipText: { fontSize: 13, color: theme.chipText },
    modelChipTextActive: { color: '#fff', fontWeight: '600' },
    currencyRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    curChip: {
      paddingHorizontal: 16, paddingVertical: 7,
      marginRight: 8, marginBottom: 4,
    },
    curChipActive: { backgroundColor: theme.accent, borderColor: theme.accent },
    curChipText: { fontSize: 14, color: theme.chipText },
    curChipTextActive: { color: '#fff', fontWeight: '600' },
    swatchWrap: { flexDirection: 'row', flexWrap: 'wrap' },
    input: {
      backgroundColor: theme.card, borderRadius: 14, paddingHorizontal: 14,
      paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: theme.border, color: theme.text,
    },
    noteInput: { minHeight: 64, textAlignVertical: 'top' },
  });
}
