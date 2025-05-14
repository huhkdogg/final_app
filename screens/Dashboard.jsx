import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
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
      const response = await axios.get(`http://192.168.0.24:3000/budget/${userId}`);
      const fetched = response.data;
      setBudget({ total: fetched.total || 0, available: fetched.available || 0 });
    } catch (error) {
      console.error('❌ Error fetching budget:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://192.168.0.24:3000/transactions/${userId}`);
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
      await axios.post('http://192.168.0.24:3000/budget', { amount, userId });
      Alert.alert('Success', 'Budget updated!');
      fetchBudget();
      setNewBudget('');
      fetchTransactions(); // Refresh transactions after setting budget
    } catch (error) {
      console.error('❌ Failed to save budget:', error);
      Alert.alert('Error', 'Failed to set budget');
    }
  };

  const expenseTransactions = transactions
    .filter((tx) => tx.type === 'expense')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome to your Dashboard!</Text>

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

        <Text style={[styles.label, { fontSize: 20, marginBottom: 10 }]}>All Expenses</Text>
        {expenseTransactions.length === 0 ? (
          <Text style={{ color: '#555', marginBottom: 15 }}>No expenses available.</Text>
        ) : (
          expenseTransactions.map((tx) => (
            <View key={tx.id} style={styles.recentItem}>
              <Text style={styles.expenseDateItem}>
                {new Date(tx.created_at).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.expenseText}>{tx.description}</Text>
              <Text style={styles.expenseText}>₱{Number(tx.amount).toFixed(2)}</Text>
            </View>
          ))
        )}
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
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, color: '#333', fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#d1b3ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: 'black', fontWeight: 'bold' },
  budgetCard: {
    backgroundColor: '#e6e6e6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  balanceCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  label: { color: '#333', marginBottom: 5 },
  amount: { color: '#333', fontSize: 28, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#d1b3ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButtonText: { fontSize: 30, color: 'black', fontWeight: 'bold' },
  recentItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  expenseText: {
    fontSize: 16,
    color: '#333',
  },
  expenseDateItem: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
