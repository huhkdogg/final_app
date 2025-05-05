
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default function TransactionHistory({ route }) {
  const { userId } = route.params;
  const [transactions, setTransactions] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchTransactions();
    }
  }, [isFocused]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://192.168.1.7:3000/transactions/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDelete = async (id, amount, type) => {
    try {
      await axios.delete(`http://192.168.1.7:3000/transactions/${id}`);
      if (type === 'expense') {
        await axios.post(`http://192.168.1.7:3000/budget/restore`, {
          userId,
          restoreAmount: amount,
        });
      }
      fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
      console.error('Delete error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.amount}>₱{Number(item.amount).toFixed(2)} ({item.type})</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id, item.amount, item.type)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a' },
  title: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  transactionItem: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  description: { color: 'white', fontSize: 16 },
  amount: { color: '#fbbf24', fontSize: 16 },
  delete: { color: '#ef4444', fontWeight: 'bold' },
});
