import React, {useContext, useMemo, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {applyToJob} from '../services/jobService';
import {createNotification} from '../services/notificationService';

const JobDetailsScreen = ({route, navigation}) => {
  const {job} = route.params;
  const {user, profile} = useContext(AuthContext);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(
    job?.applicants?.some(a => a.userId === user.uid),
  );

  const isOwner = useMemo(
    () => job?.employerId === user.uid,
    [job, user.uid],
  );

  const handleApply = async () => {
    if (applied) {
      Alert.alert('Application sent', 'You already applied to this job.');
      return;
    }

    setApplying(true);
    try {
      await applyToJob(job.id, user.uid, profile.name);
      await createNotification(job.employerId, {
        userId: user.uid,
        title: 'New Job Application',
        body: `${profile.name} applied to ${job.title}`,
        jobId: job.id,
      });
      setApplied(true);
      Alert.alert('Success', 'Your application was submitted.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.badge}>{job.type || 'Job Role'}</Text>

        <Text style={styles.employer}>{job.employerName || 'Employer'}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{job.location || 'Remote'}</Text>
          <Text style={styles.meta}>${job.salary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the role</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applications</Text>
          <Text style={styles.description}>
            {job.applicants?.length || 0} candidate{job.applicants?.length === 1 ? '' : 's'} applied
          </Text>
        </View>

        {!isOwner && (
          <TouchableOpacity
            style={[styles.button, (applied || applying) && styles.disabledButton]}
            onPress={handleApply}
            disabled={applied || applying}>
            <Text style={styles.buttonText}>{applied ? 'Applied' : 'Apply Now'}</Text>
          </TouchableOpacity>
        )}

        
      </View>
    </ScrollView>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 18},
    elevation: 12,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8b500',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 18,
  },
  employer: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  meta: {
    color: '#94a3b8',
    fontSize: 14,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    color: '#cbd5e1',
    lineHeight: 22,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#f8b500',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#475569',
  },
  buttonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});