import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {logoutUser} from '../services/authService';

const ProfileScreen = () => {
  const {user, profile} = useContext(AuthContext);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Personal details and account settings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile?.name || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'N/A'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{profile?.role || 'N/A'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: {
    color: '#94a3b8',
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#f8b500',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 16,
  },
});