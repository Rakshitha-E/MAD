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

import {loginUser, getUserProfile, logoutUser, isAdminCredential, createUserProfile} from '../services/authService';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleLogin = async () => {
    try {
      if (role === 'admin' && !isAdminCredential(email, password)) {
        Alert.alert(
          'Access denied',
          'Admin login requires admin@gmail.com and password admin@123.',
        );
        return;
      }

      const user = await loginUser(email, password);
      let profile = await getUserProfile(user.uid);

      if (!profile) {
        if (role === 'admin' && isAdminCredential(email, password)) {
          await createUserProfile({
            uid: user.uid,
            name: 'Admin',
            email,
            role: 'admin',
          });
          profile = await getUserProfile(user.uid);
        } else {
          await logoutUser();
          Alert.alert('Login Error', 'Profile not found.');
          return;
        }
      }

      if (role === 'admin' && profile.role !== 'admin') {
        await logoutUser();
        Alert.alert('Access denied', 'This account is not an admin.');
        return;
      }

      if (role === 'user' && profile.role === 'admin') {
        await logoutUser();
        Alert.alert('Use admin login', 'This account is an admin. Choose admin login.');
        return;
      }
    } catch (error) {
      Alert.alert('Login Error', error?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to access your FairWork dashboard</Text>

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

        <View style={styles.roleRow}>
          {['user', 'admin'].map(item => (
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
                {item === 'user' ? 'User' : 'Admin'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

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
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: 20},
    elevation: 12,
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
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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