import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function AddExpenseScreen({ route, navigation }) {
  const { userId } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(`http://192.168.1.7:3000/budget/${userId}`);
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

    const newExpense = {
      amount: parseFloat(amount),
      description,
      type: 'expense',
      userId,
    };

    try {
      await axios.post('http://192.168.1.7:3000/transactions', newExpense);
      await axios.post('http://192.168.1.7:3000/budget/deduct', {
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
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 10,
    color: 'white',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
