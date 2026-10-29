import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { CarStoreProvider } from './src/CarStore';
import HomeScreen from './src/screens/HomeScreen';
import AddEditScreen from './src/screens/AddEditScreen';
import DetailScreen from './src/screens/DetailScreen';

export default function App() {
  const [route, setRoute] = useState({ name: 'home' });

  const navigate = (name, params) => setRoute({ name, ...(params ? { params } : {}) });

  return (
    <CarStoreProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" />
        {route.name === 'home' && (
          <HomeScreen
            onAdd={() => navigate('add')}
            onOpen={(id) => navigate('detail', { carId: id })}
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
      </SafeAreaView>
    </CarStoreProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6F8' },
});
