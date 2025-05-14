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
      const response = await axios.get(`http://192.168.0.24:3000/transactions/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDelete = async (id, amount, type) => {
    try {
      await axios.delete(`http://192.168.0.24:3000/transactions/${id}`);
      if (type === 'expense') {
        await axios.post(`http://192.168.0.24:3000/budget/restore`, {
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
      <View style={styles.itemContent}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.amount}>₱{Number(item.amount).toFixed(2)} ({item.type})</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id, item.amount, item.type)}
      >
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
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    color: '#fbbf24',
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ef4444',
    borderRadius: 5,
  },
  delete: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
