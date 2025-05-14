import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Image at the top */}
      <Image
        source={require('../assets/wc.png')} // update path as needed
        style={styles.image}
        resizeMode="contain"
      />

      {/* App Title */}
      <Text style={styles.title}>
        Welcome to <Text style={styles.brand}>ExpenseTracker</Text>
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Track every cent. Manifest every dream.</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Let's start</Text>
      </TouchableOpacity>

      {/* Terms and Privacy */}
      <Text style={styles.termsText}>
        By using this app, you agree to our{' '}
        <Text style={styles.link}>Terms of Use</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // white background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    color: '#000000', // black text
    marginBottom: 8,
    textAlign: 'center',
  },
  brand: {
    fontWeight: 'bold',
    color: '#7c3aed', // deep pastel purple
  },
  subtitle: {
    color: '#4b5563', // softer gray for subtitle
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#d8b4fe', // pastel purple
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    color: '#6b7280', // muted gray
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#7c3aed',
    fontWeight: 'bold',
  },
});
