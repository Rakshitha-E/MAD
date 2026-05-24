import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {getJobsRealtime, deleteJob} from '../services/jobService';
import {AuthContext} from '../context/AuthContext';

const ManageJobsScreen = () => {
  const {profile} = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getJobsRealtime(
      jobList => {
        setJobs(jobList);
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

  const handleDelete = async id => {
    Alert.alert('Delete job', 'Are you sure you want to remove this job?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteJob(id);
          } catch (error) {
            Alert.alert('Error', 'Could not delete job.');
          }
        },
      },
    ]);
  };

  if (profile?.role !== 'admin') {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>Only admins can manage jobs.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Jobs</Text>
        <Text style={styles.subtitle}>Review and remove job posts across the platform.</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#f8b500" />
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No jobs available yet.</Text>
          <Text style={styles.emptyDetail}>New job posts will appear here automatically.</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobType}>{item.type}</Text>
              </View>
              <Text style={styles.jobText}>{item.employerName || 'Employer'}</Text>
              <Text style={styles.jobText}>₹{item.salary}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ManageJobsScreen;

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
  jobCard: {
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 14},
    elevation: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jobTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    marginRight: 12,
  },
  jobType: {
    color: '#f8b500',
    fontWeight: '800',
  },
  jobText: {
    color: '#cbd5e1',
    marginBottom: 6,
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#dc2626',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '800',
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