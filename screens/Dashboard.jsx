import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default function DashboardScreen({ route, navigation }) {
  const { userId } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({ total: 0, available: 0 });
  const [newBudget, setNewBudget] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchBudget();
      fetchTransactions();
    }
  }, [isFocused]);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(`http://192.168.1.7:3000/budget/${userId}`);
      const fetched = response.data;
      setBudget({ total: fetched.total || 0, available: fetched.available || 0 });
    } catch (error) {
      console.error("❌ Error fetching budget:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://192.168.1.7:3000/transactions/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error);
    }
  };

  const handleSetBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid budget amount');
      return;
    }

    try {
      await axios.post('http://192.168.1.7:3000/budget', { amount, userId });
      Alert.alert('Success', 'Budget updated and transactions cleared!');
      fetchBudget();
      setNewBudget('');
      fetchTransactions(); // This will now show empty list
    } catch (error) {
      console.error("❌ Failed to save budget:", error);
      Alert.alert('Error', 'Failed to set budget');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dashboard</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Set Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new budget"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={newBudget}
            onChangeText={setNewBudget}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSetBudget}>
            <Text style={styles.saveButtonText}>Save Budget</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.budgetCard}>
          <Text style={styles.label}>Total Budget</Text>
          <Text style={styles.amount}>₱{Number(budget.total).toFixed(2)}</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.amount}>₱{Number(budget.available).toFixed(2)}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddExpense', { userId })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  budgetCard: { backgroundColor: '#334155', borderRadius: 16, padding: 20, marginBottom: 10 },
  balanceCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 20 },
  label: { color: 'white', marginBottom: 5 },
  amount: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButtonText: { fontSize: 30, color: 'white', fontWeight: 'bold' },
});