import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {getNotificationsRealtime} from '../services/notificationService';

const NotificationsScreen = () => {
  const {user} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = getNotificationsRealtime(
      user.uid,
      items => {
        setNotifications(items);
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
  }, [user?.uid]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Keep track of updates, applications, and alerts.</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#f8b500" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No notifications yet.</Text>
          <Text style={styles.emptyBody}>Important alerts will appear here as soon as they arrive.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationBody}>{item.body}</Text>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
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
    minHeight: 200,
  },
  list: {
    paddingBottom: 40,
  },
  notificationCard: {
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  notificationBody: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
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
  emptyBody: {
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
});