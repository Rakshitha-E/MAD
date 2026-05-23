import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {getJobsRealtime, getEmployerJobsRealtime} from '../services/jobService';
import {seedDemoJobsIfEmpty, seedDemoNotificationsForUser} from '../services/demoDataService';
import JobCard from '../components/JobCard';

const HomeScreen = ({navigation}) => {
  const {user, profile} = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seededDemo, setSeededDemo] = useState(false);

  useEffect(() => {
    let unsubscribe = null;

    if (profile?.role === 'employer') {
      unsubscribe = getEmployerJobsRealtime(
        user.uid,
        jobList => {
          setJobs(jobList);
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      );
    } else {
      unsubscribe = getJobsRealtime(
        jobList => {
          setJobs(jobList);
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [profile, user]);

  useEffect(() => {
    if (!user?.uid || !profile || seededDemo) {
      return;
    }

    const seedDemo = async () => {
        try {
        await seedDemoJobsIfEmpty();
        await seedDemoNotificationsForUser(user.uid);
      } catch (error) {
        console.log('Demo data seed error:', error);
      } finally {
        setSeededDemo(true);
      }
    };

    seedDemo();
  }, [user, profile, seededDemo]);

  const handleOpenDetails = job => {
    navigation.navigate('JobDetails', {job});
  };

  return (
    <View style={styles.page}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>Hello, {profile?.name || 'FairWork User'}</Text>
        <Text style={styles.tagline}>
          {profile?.role === 'employer'
            ? 'Your marketplace for premium talent'
            : 'Discover the best jobs near you'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            profile?.role === 'admin'
              ? navigation.navigate('Admin')
              : profile?.role === 'employer'
              ? navigation.navigate('AddJob')
              : navigation.navigate('Notifications')
          }>
          <Text style={styles.actionTitle}>
            {profile?.role === 'admin'
              ? 'Admin Dashboard'
              : profile?.role === 'employer'
              ? 'Post a Job'
              : 'View Notifications'}
          </Text>
          <Text style={styles.actionSubtitle}>
            {profile?.role === 'admin'
              ? 'Manage the platform'
              : profile?.role === 'employer'
              ? 'Create premium job posts'
              : 'Stay notified on new openings'}
          </Text>
        </TouchableOpacity>

        

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.actionTitle}>Profile</Text>
          <Text style={styles.actionSubtitle}>View or update your profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest jobs</Text>
        <Text style={styles.sectionCaption}>Updated in real time</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#f8b500" />
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No jobs available right now.</Text>
          <Text style={styles.emptySubtitle}>Check back later or add a job if you are an employer.</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <JobCard job={item} onPress={() => handleOpenDetails(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  hero: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 18,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  actionTitle: {
    color: '#f8b500',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  actionSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionCaption: {
    color: '#94a3b8',
    fontSize: 13,
  },
  list: {
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});