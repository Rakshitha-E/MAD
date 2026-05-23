import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {getUsersRealtime, updateUserRole} from '../services/authService';

const ManageUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getUsersRealtime(
      userList => {
        setUsers(userList);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const changeRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      Alert.alert('Updated', `Role updated to ${role}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to update role.');
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Users</Text>
        <Text style={styles.subtitle}>Assign roles and keep your team organized.</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#f8b500" />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No users found.</Text>
          <Text style={styles.emptyDetail}>Users will appear here as they sign up.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.userCard}>
              <View style={styles.userHeader}>
                <Text style={styles.userName}>{item.name || item.email}</Text>
                <Text style={styles.currentRole}>{item.role || 'worker'}</Text>
              </View>
              <View style={styles.buttonRow}>
                {['worker', 'employer', 'admin'].map(roleOption => (
                  <TouchableOpacity
                    key={roleOption}
                    style={styles.roleButton}
                    onPress={() => changeRole(item.id, roleOption)}>
                    <Text style={styles.roleText}>{roleOption}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ManageUsersScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    marginRight: 12,
  },
  currentRole: {
    color: '#f8b500',
    fontWeight: '800',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
  },
  roleText: {
    color: '#fff',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDetail: {
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 280,
  },
});