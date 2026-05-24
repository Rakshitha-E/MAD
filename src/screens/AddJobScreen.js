import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {createJob} from '../services/jobService';

const AddJobScreen = ({navigation}) => {
  const {user, profile} = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  const handleAddJob = async () => {
    if (!title || !description || !salary || !type || !location) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      console.log('createJob called with uid=', user?.uid, 'role=', profile?.role);
      await createJob({
        title,
        description,
        salary,
        type,
        location,
        employerId: user.uid,
        employerName: profile?.name || 'Employer',
      });

      Alert.alert('Success', 'Job Posted');

      setTitle('');
      setDescription('');
      setSalary('');
      setType('');
      setLocation('');
      navigation.navigate('Home');
    } catch (error) {
      console.log('createJob error:', error, 'uid=', user?.uid, 'role=', profile?.role);
      Alert.alert(
        'Error',
        `${error?.message || 'Failed to post job'}\nUID: ${user?.uid || 'unknown'}\nRole: ${profile?.role || 'unknown'}`,
      );
    }
  };

  if (profile?.role !== 'employer' && profile?.role !== 'admin') {
    return (
      <View style={styles.page}>
        <Text style={styles.header}>Access Denied</Text>
        <Text style={styles.subheader}>Only employers or admins can post jobs.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Text style={styles.header}>Post a premium job</Text>
        <Text style={styles.subheader}>Create a clean job listing that stands out.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            placeholder="Product designer, electrician, driver"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Description</Text>
          <TextInput
            placeholder="Enter the role, requirements, and benefits"
            placeholderTextColor="#94a3b8"
            style={[styles.input, styles.textArea]}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Salary</Text>
            <TextInput
              placeholder="USD"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              keyboardType="numeric"
              value={salary}
              onChangeText={setSalary}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Job Type</Text>
            <TextInput
              placeholder="Full-time"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={type}
              onChangeText={setType}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            placeholder="City, region or remote"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddJob}>
          <Text style={styles.buttonText}>Publish Job</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddJobScreen;

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 18},
    elevation: 12,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subheader: {
    color: '#94a3b8',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  halfInput: {
    flex: 1,
  },
  button: {
    backgroundColor: '#f8b500',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 16,
  },
});