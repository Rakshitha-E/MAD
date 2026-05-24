import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const JobDetailsScreen = ({route}) => {
  const {job} = route.params;

  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (applied) {
      Alert.alert('Application sent', 'You already applied to this job.');
      return;
    }

    setApplied(true);

    Alert.alert('Success', 'Your application was submitted.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{job.type}</Text>
      </View>

      <Text style={styles.company}>{job.employerName}</Text>
      <Text style={styles.location}>{job.location}</Text>

      <Text style={styles.salary}>₹{job.salary}</Text>

      <Text style={styles.section}>About the role</Text>

      <Text style={styles.description}>
        {job.description}
      </Text>

      <TouchableOpacity
        style={[
          styles.applyButton,
          applied && styles.appliedButton,
        ]}
        onPress={handleApply}>
        <Text style={styles.applyText}>
          {applied ? 'Applied' : 'Apply Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 12,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8b500',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 18,
  },

  badgeText: {
    color: '#111827',
    fontWeight: '800',
  },

  company: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  location: {
    color: '#94a3b8',
    marginBottom: 16,
  },

  salary: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },

  section: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  description: {
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 40,
  },

  applyButton: {
    backgroundColor: '#f8b500',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  appliedButton: {
    backgroundColor: '#16a34a',
  },

  applyText: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 16,
  },
});