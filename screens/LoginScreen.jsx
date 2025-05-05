import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.7:3000/login', {
        email,
        password,
      });

      const { userId } = response.data;
      navigation.replace('MainApp', { userId });
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        console.error(error);
        alert('Login error.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to your account</Text>

      <Text style={styles.label}>Your email</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        Don’t have an account yet?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
          Sign up
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
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    transform: [{ translateY: -10 }], // center icon vertically (half of size)
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
