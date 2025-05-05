import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen({ route }) {
  const { userId } = route.params;
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    address: '',
    birthday: null, // set to null by default
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://192.168.1.7:3000/user/${userId}`);
      const data = res.data;
      setProfile((prev) => ({
        ...prev,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        age: data.age || '',
        address: data.address || '',
        birthday: data.birthday ? new Date(data.birthday) : null,
        gender: data.gender || '',
      }));
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://192.168.1.7:3000/user/update/${userId}`, {
        age: profile.age,
        address: profile.address,
        birthday: profile.birthday ? profile.birthday.toISOString().split('T')[0] : null,
        gender: profile.gender,
      });
      Alert.alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error updating profile.');
    }
  };

  const handleChangePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      return Alert.alert('Error', 'New passwords do not match.');
    }

    try {
      await axios.put(`http://192.168.1.7:3000/user/change-password/${userId}`, {
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword,
      });
      Alert.alert('Password changed successfully!');
      setProfile({ ...profile, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error changing password:', err);
      Alert.alert('Error changing password.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Profile</Text>

      <TextInput
        style={styles.input}
        value={profile.firstName}
        editable={false}
        placeholder="First Name"
        placeholderTextColor="#94a3b8"
      />
      <TextInput
        style={styles.input}
        value={profile.lastName}
        editable={false}
        placeholder="Last Name"
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        placeholderTextColor="#94a3b8"
        value={profile.age}
        onChangeText={(age) => setProfile({ ...profile, age })}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        placeholderTextColor="#94a3b8"
        value={profile.address}
        onChangeText={(address) => setProfile({ ...profile, address })}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: profile.birthday ? 'white' : '#94a3b8' }}>
          {profile.birthday ? profile.birthday.toDateString() : 'Select your birthday'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={profile.birthday || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setProfile({ ...profile, birthday: date });
          }}
        />
      )}

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={profile.gender}
          style={styles.picker}
          onValueChange={(gender) => setProfile({ ...profile, gender })}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Change Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={!showCurrentPassword}
          placeholderTextColor="#94a3b8"
          value={profile.currentPassword}
          onChangeText={(t) => setProfile({ ...profile, currentPassword: t })}
        />
        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={showCurrentPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#94a3b8"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
          placeholderTextColor="#94a3b8"
          value={profile.newPassword}
          onChangeText={(t) => setProfile({ ...profile, newPassword: t })}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={showNewPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#94a3b8"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmPassword}
          placeholderTextColor="#94a3b8"
          value={profile.confirmPassword}
          onChangeText={(t) => setProfile({ ...profile, confirmPassword: t })}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#94a3b8"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#3b82f6' }]} onPress={handleChangePassword}>
        <Text style={styles.saveButtonText}>Change Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  title: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: { color: 'white', marginTop: 20, marginBottom: 5 },
  pickerContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
