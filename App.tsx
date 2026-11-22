import React from 'react';
import { StatusBar } from 'react-native';
import { DependencyProvider } from './src/app/DependencyProvider';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { NavigationProvider } from './src/presentation/navigation/NavigationProvider';

const App = () => (
  <DependencyProvider>
    <NavigationProvider>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </NavigationProvider>
  </DependencyProvider>
);

export default App;