import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';

const AdminScreen = ({navigation}) => {
  const {profile} = useContext(AuthContext);

  if (profile?.role !== 'admin') {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>You must be an admin to access this page.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>A premium control center for jobs and users.</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AddJob')}>
          <Text style={styles.cardTitle}>Add Job</Text>
          <Text style={styles.cardText}>Publish a new role instantly.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ManageJobs')}>
          <Text style={styles.cardTitle}>Manage Jobs</Text>
          <Text style={styles.cardText}>Review and remove listings.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ManageUsers')}>
          <Text style={styles.cardTitle}>Manage Users</Text>
          <Text style={styles.cardText}>Edit roles and access.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 24,
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 14},
    elevation: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
});