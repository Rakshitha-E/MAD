import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoCard}>
        <Text style={styles.logo}>FairWork</Text>
        <Text style={styles.tagline}>A premium marketplace for talent and opportunity.</Text>
      </View>
      <Text style={styles.powered}>Built for modern teams</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoCard: {
    backgroundColor: '#111827',
    borderRadius: 28,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: 18},
    elevation: 14,
  },
  logo: {
    color: '#f8b500',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tagline: {
    color: '#cbd5e1',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  powered: {
    color: '#94a3b8',
    marginTop: 28,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});