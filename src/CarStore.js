import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ensureImagesDir, saveImageToDocuments, deleteImageFile } from './storage';

const STORAGE_KEY = 'tomica_cars_v1';

const CarStoreContext = createContext(null);

export function CarStoreProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 启动时加载
  useEffect(() => {
    (async () => {
      await ensureImagesDir();
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setCars(JSON.parse(raw));
      } catch (e) {
        // 忽略
      }
      setLoaded(true);
    })();
  }, []);

  const persist = (next) => {
    setCars(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const makeId = () => `car_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const addCar = async ({ modelName, colorName, colorHex, note, imageUri, price, currency, purchaseLocation }) => {
    let savedImage = null;
    if (imageUri) savedImage = await saveImageToDocuments(imageUri);
    const car = {
      id: makeId(),
      modelName,
      colorName,
      colorHex,
      note: note || '',
      price: price != null ? String(price) : '',
      currency: currency || '¥',
      purchaseLocation: purchaseLocation || '',
      imageUri: savedImage,
      dateAdded: Date.now(),
    };
    persist([car, ...cars]);
    return car;
  };

  const updateCar = async (id, { modelName, colorName, colorHex, note, imageUri, price, currency, purchaseLocation }) => {
    const old = cars.find((c) => c.id === id);
    let savedImage = old ? old.imageUri : null;
    if (imageUri) {
      // 换图才复制新图，并删旧图
      if (imageUri !== savedImage) {
        savedImage = await saveImageToDocuments(imageUri);
        if (old && old.imageUri) deleteImageFile(old.imageUri);
      }
    } else {
      // 移除图片
      if (old && old.imageUri) deleteImageFile(old.imageUri);
      savedImage = null;
    }
    const next = cars.map((c) =>
      c.id === id
        ? {
            ...c,
            modelName,
            colorName,
            colorHex,
            note: note || '',
            price: price != null ? String(price) : '',
            currency: currency || '¥',
            purchaseLocation: purchaseLocation || '',
            imageUri: savedImage,
          }
        : c
    );
    persist(next);
  };

  const deleteCar = (id) => {
    const car = cars.find((c) => c.id === id);
    if (car && car.imageUri) deleteImageFile(car.imageUri);
    persist(cars.filter((c) => c.id !== id));
  };

  return (
    <CarStoreContext.Provider value={{ cars, loaded, addCar, updateCar, deleteCar }}>
      {children}
    </CarStoreContext.Provider>
  );
}

export function useCarStore() {
  const ctx = useContext(CarStoreContext);
  if (!ctx) throw new Error('useCarStore 必须在 CarStoreProvider 内使用');
  return ctx;
}
