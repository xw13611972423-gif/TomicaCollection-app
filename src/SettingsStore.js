import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme } from './theme';

const KEY = 'tomica_settings_v1';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState('system'); // 'system' | 'light' | 'dark'
  const [glass, setGlassState] = useState(true);
  const [emptyImageUri, setEmptyImageUriState] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p.mode) setModeState(p.mode);
          if (typeof p.glass === 'boolean') setGlassState(p.glass);
          if (p.emptyImageUri) setEmptyImageUriState(p.emptyImageUri);
        }
      } catch (e) {
        // 忽略
      }
      setLoaded(true);
    })();
  }, []);

  const persist = (patch) => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        let cur = {};
        try { cur = raw ? JSON.parse(raw) : {}; } catch (e) {}
        AsyncStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch })).catch(() => {});
      })
      .catch(() => {});
  };

  const setMode = (m) => { setModeState(m); persist({ mode: m }); };
  const setGlass = (g) => { setGlassState(g); persist({ glass: g }); };
  const setEmptyImageUri = (uri) => { setEmptyImageUriState(uri); persist({ emptyImageUri: uri }); };

  const resolved = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const theme = useMemo(() => createTheme(resolved), [resolved]);

  return (
    <SettingsContext.Provider
      value={{
        mode,
        setMode,
        glass,
        setGlass,
        emptyImageUri,
        setEmptyImageUri,
        isDark: resolved === 'dark',
        theme,
        loaded,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings 必须在 SettingsProvider 内使用');
  return ctx;
}
