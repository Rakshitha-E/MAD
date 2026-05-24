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

import {
  loginUser,
  getUserProfile,
  logoutUser,
  isAdminCredential,
  createUserProfile,
  setAdminRole,
  updateUserRole,
} from '../services/authService';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');

  const handleLogin = async () => {
    try {

      // =========================
      // ADMIN CHECK
      // =========================

      if (role === 'admin' && !isAdminCredential(email, password)) {
        Alert.alert(
          'Access denied',
          'Admin login requires admin@gmail.com and password admin@123.',
        );
        return;
      }

      // =========================
      // LOGIN
      // =========================

      const user = await loginUser(email, password);

      let profile = await getUserProfile(user.uid);

      // =========================
      // ADMIN ROLE SETUP
      // =========================

      if (isAdminCredential(email, password)) {
        await setAdminRole(user.uid, email);

        profile = await getUserProfile(user.uid);

        if (profile?.role !== 'admin') {
          await logoutUser();

          Alert.alert(
            'Admin role error',
            'Could not assign admin role.',
          );

          return;
        }
      }

      // =========================
      // CREATE PROFILE IF MISSING
      // =========================

      if (!profile) {
        let newRole = role;

        if (role === 'admin') {
          newRole = 'admin';
        }

        await createUserProfile({
          uid: user.uid,
          name: email.split('@')[0],
          email,
          role: newRole,
        });

        profile = await getUserProfile(user.uid);
      }

      // =========================
      // FIX OLD USER ROLES
      // =========================

      else if (!profile.role) {

        const normalizedRole =
          ['worker', 'employer', 'admin'].includes(role)
            ? role
            : 'worker';

        await updateUserRole(user.uid, normalizedRole);

        profile = await getUserProfile(user.uid);
      }

      // =========================
      // EMPLOYER LOGIN
      // =========================

      else if (
        role === 'employer' &&
        profile.role !== 'employer'
      ) {
        await updateUserRole(user.uid, 'employer');

        profile = await getUserProfile(user.uid);
      }

      // =========================
      // ADMIN VALIDATION
      // =========================

      if (role === 'admin' && profile.role !== 'admin') {
        await logoutUser();

        Alert.alert(
          'Access denied',
          'This account is not admin.',
        );

        return;
      }

      // =========================
      // BLOCK ADMIN FROM WORKER LOGIN
      // =========================

      if (
        role === 'worker' &&
        profile.role === 'admin'
      ) {
        await logoutUser();

        Alert.alert(
          'Wrong login',
          'Use admin login for admin account.',
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      Alert.alert('Success', 'Login successful');

    } catch (error) {
      Alert.alert(
        'Login Error',
        error?.message || 'Something went wrong',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>

        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to access your FairWork dashboard
        </Text>

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

        {/* ROLE SELECTOR */}

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
                  role === item &&
                    styles.roleTextSelected,
                ]}>

                {item.charAt(0).toUpperCase() +
                  item.slice(1)}

              </Text>

            </TouchableOpacity>
          ))}

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}>

          <Text style={styles.buttonText}>
            Sign In
          </Text>

        </TouchableOpacity>

        <View style={styles.footerRow}>

          <Text style={styles.footerText}>
            New here?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Signup')
            }>

            <Text style={styles.link}>
              Create account
            </Text>

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