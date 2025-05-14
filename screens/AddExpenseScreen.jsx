import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';

export default function AddExpenseScreen({ route, navigation }) {
  const { userId } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(`http://192.168.0.24:3000/budget/${userId}`);
      setBudget(response.data.available || 0);
    } catch (error) {
      console.error('Failed to fetch budget:', error);
    }
  };

  const handleAddExpense = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (parseFloat(amount) > budget) {
      Alert.alert('Error', 'Expense exceeds available budget');
      return;
    }

    try {
      await axios.post('http://192.168.0.24:3000/transactions', {
        amount: parseFloat(amount),
        description,
        type: 'expense',
        userId,
      });
      await axios.post('http://192.168.0.24:3000/budget/deduct', {
        userId,
        expense: parseFloat(amount),
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Add New Expense</Text>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grocery Shopping"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#6b7280"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 250.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#6b7280"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Save Expense</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
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
  button: {
    backgroundColor: '#d8b4fe',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 13,
  },
});
