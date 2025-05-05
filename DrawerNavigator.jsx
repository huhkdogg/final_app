// ✅ DrawerNavigator.js
import React, { useEffect, useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import Dashboard from './screens/Dashboard';
import TransactionScreen from './screens/TransactionHistory';
import ProfileScreen from './screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [fullName, setFullName] = useState('');
  const userId = props.route.params?.userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://192.168.1.7:3000/user/${userId}`);
        const { first_name, last_name } = response.data;
        setFullName(`${first_name} ${last_name}`);
      } catch (err) {
        console.error('Failed to fetch full name:', err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{fullName}</Text>
        </View>
        <DrawerItemList {...props} />
      </View>
      <View style={{ borderTopWidth: 1, borderColor: '#ccc' }}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: '#ef4444' }}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#ef4444" />
          )}
          onPress={() => props.navigation.replace('Login')}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator({ route, navigation }) {
  const userId = route.params?.userId;

  useEffect(() => {
    if (!userId) {
      navigation.replace('Login');
    }
  }, [userId, navigation]);

  if (!userId) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} route={{ params: { userId } }} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#1e293b' },
        drawerActiveTintColor: '#3b82f6',
        drawerInactiveTintColor: '#cbd5e1',
        drawerLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="Transaction"
        component={TransactionScreen}
        initialParams={{ userId }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userId }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
