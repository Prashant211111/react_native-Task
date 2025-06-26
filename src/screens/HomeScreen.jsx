import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      const stored = await AsyncStorage.getItem('products');
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    };

    const verifyToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) navigation.replace('LoginScreen');
    };

    verifyToken();
    const unsubscribe = navigation.addListener('focus', fetchProducts);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('LoginScreen');
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const updated = products.filter((item) => item.id !== id);
          setProducts(updated);
          await AsyncStorage.setItem('products', JSON.stringify(updated));
        },
        style: 'destructive',
      },
    ]);
  };

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Product List</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>
              {item.name} — ₹{item.price}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No Product Found</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProductScreen')}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: { fontSize: 22, fontWeight: 'bold' },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderColor: '#eee',
    borderWidth: 1,
  },
  productText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
});

export default HomeScreen;
