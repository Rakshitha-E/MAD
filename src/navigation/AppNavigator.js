import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddJobScreen from '../screens/AddJobScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import ManageJobsScreen from '../screens/ManageJobsScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#0f172a'},
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="AddJob" component={AddJobScreen} />
      
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="ManageJobs" component={ManageJobsScreen} />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;