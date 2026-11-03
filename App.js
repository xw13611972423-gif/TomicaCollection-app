import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { CarStoreProvider } from './src/CarStore';
import { SettingsProvider, useSettings } from './src/SettingsStore';
import GlassBackdrop from './src/components/GlassBackdrop';
import FadeIn from './src/components/FadeIn';
import HomeScreen from './src/screens/HomeScreen';
import AddEditScreen from './src/screens/AddEditScreen';
import DetailScreen from './src/screens/DetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

function Router() {
  const [route, setRoute] = useState({ name: 'home' });
  const { theme, isDark, glass } = useSettings();

  const navigate = (name, params) => setRoute({ name, ...(params ? { params } : {}) });

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {glass && <GlassBackdrop theme={theme} />}
      <FadeIn key={route.name} style={{ flex: 1 }}>
        {route.name === 'home' && (
          <HomeScreen
            onAdd={() => navigate('add')}
            onOpen={(id) => navigate('detail', { carId: id })}
            onSettings={() => navigate('settings')}
          />
        )}
        {route.name === 'add' && (
          <AddEditScreen
            onDone={() => navigate('home')}
            onCancel={() => navigate('home')}
          />
        )}
        {route.name === 'edit' && (
          <AddEditScreen
            carId={route.params?.carId}
            onDone={() => navigate('detail', { carId: route.params?.carId })}
            onCancel={() => navigate('detail', { carId: route.params?.carId })}
          />
        )}
        {route.name === 'detail' && (
          <DetailScreen
            carId={route.params?.carId}
            onBack={() => navigate('home')}
            onEdit={(id) => navigate('edit', { carId: id })}
            onDeleted={() => navigate('home')}
          />
        )}
        {route.name === 'settings' && <SettingsScreen onBack={() => navigate('home')} />}
      </FadeIn>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <CarStoreProvider>
        <Router />
      </CarStoreProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
