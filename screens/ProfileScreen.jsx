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
      const res = await axios.get(`http://192.168.0.24:3000/user/${userId}`);
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
      console.log('Updating profile...'); // Debug
      await axios.put(`http://192.168.0.24:3000/user/update/${userId}`, {
        age: profile.age,
        address: profile.address,
        birthday: profile.birthday ? profile.birthday.toISOString().split('T')[0] : null,
        gender: profile.gender,
      });
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };
  

  const handleChangePassword = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      return Alert.alert('Error', 'New passwords do not match.');
    }

    try {
      await axios.put(`http://192.168.0.24:3000/user/change-password/${userId}`, {
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
        <Text style={{ color: profile.birthday ? 'black' : '#94a3b8' }}>
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
           <Picker.Item label="Select Gender" value="" color="#black" />
           <Picker.Item label="Male" value="male" color="black" />
           <Picker.Item label="Female" value="female" color="black" />
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginBottom: 16,
  },
  picker: {
    color: '#000000',
    paddingHorizontal: 14,
  },
  saveButton: {
    backgroundColor: '#d8b4fe',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  saveButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
