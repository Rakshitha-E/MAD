import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import {signupUser, isAdminCredential} from '../services/authService';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');

  const handleSignup = async () => {
    try {
      if (role === 'admin' && !isAdminCredential(email, password)) {
        Alert.alert(
          'Admin signup denied',
          'Admin accounts must use admin@gmail.com and password admin@123.',
        );
        return;
      }

      await signupUser(name, email, password, role);
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Error', error?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the FairWork platform with a polished experience.</Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Choose your role</Text>
        <View style={styles.roleRow}>
          {['worker', 'employer', 'admin'].map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.roleOption,
                role === item && styles.roleSelected,
              ]}
              onPress={() => setRole(item)}>
              <Text
                style={[
                  styles.roleText,
                  role === item && styles.roleTextSelected,
                ]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 22},
    elevation: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: {
    color: '#94a3b8',
    marginBottom: 10,
    fontWeight: '600',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: '#f8b500',
    borderColor: '#f8b500',
  },
  roleText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  roleTextSelected: {
    color: '#111827',
  },
  button: {
    backgroundColor: '#f8b500',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    marginRight: 8,
  },
  link: {
    color: '#f8b500',
    fontWeight: '700',
  },
});