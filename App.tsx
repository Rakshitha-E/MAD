import React, {useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import AuthProvider, {
  AuthContext,
} from './src/context/AuthContext';

import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

import SplashScreen from './src/screens/SplashScreen';

const RootNavigation = () => {
  const {user, loading}: any =
    useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  return user ? (
    <AppNavigator />
  ) : (
    <AuthNavigator />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;