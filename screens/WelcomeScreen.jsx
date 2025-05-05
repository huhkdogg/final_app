import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo Circle */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoCircle}>
          {/* Placeholder Icon or Symbol */}
          <Text style={styles.logoSymbol}>★</Text>
        </View>

        {/* App Title */}
        <Text style={styles.title}>
          Welcome to <Text style={styles.brand}>ExpenseTracker</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Track every cent. Manifest every dream.</Text>
      </View>

      {/* Button to Navigate */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Let's start</Text>
      </TouchableOpacity>

      {/* Terms and Privacy */}
      <Text style={styles.termsText}>
        By using this app, you agree to our{' '}
        <Text style={styles.link}>Terms of Use</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    backgroundColor: '#3b82f6',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoSymbol: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
  },
  brand: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});
