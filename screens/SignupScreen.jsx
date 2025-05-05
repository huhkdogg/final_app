import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios'; // We'll use this later to connect to backend
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.7:3000/signup', {
        firstName,
        lastName,
        email,
        password,
      });

      alert(response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="name@cdd.edu.ph"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#64748b"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconWrapper}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#64748b" // Light blue icon
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#64748b"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.iconWrapper}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#64748b" // Light blue icon
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Sign in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 15,
  },
  passwordInput: {
    backgroundColor: '#1e293b',
    color: 'white',
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 40, // space for icon
    borderRadius: 8,
    fontSize: 16,
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
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    color: 'gray',
    textAlign: 'center',
  },
  link: {
    color: '#3b82f6',
  },
});
