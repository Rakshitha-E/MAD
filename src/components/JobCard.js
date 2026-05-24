import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const JobCard = ({job, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.tag}> 
          <Text style={styles.tagText}>{job.type || 'Job'}</Text>
        </View>
      </View>

      <Text style={styles.company}>{job.employerName || 'Employer'}</Text>
      <Text style={styles.location}>{job.location || 'Location not set'}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.salary}>₹{job.salary}</Text>
        <View style={styles.actionBubble}>
          <Text style={styles.actionText}>View</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginRight: 12,
  },
  tag: {
    backgroundColor: '#f8b500',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 12,
  },
  company: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 4,
  },
  location: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  actionBubble: {
    borderWidth: 1,
    borderColor: 'rgba(248,181,0,0.35)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#f8b500',
    fontWeight: '700',
  },
});