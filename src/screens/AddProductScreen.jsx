import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddProductScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [existingProducts, setExistingProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const stored = await AsyncStorage.getItem('products');
      if (stored) {
        setExistingProducts(JSON.parse(stored));
      }
    };
    loadProducts();
  }, []);

  const validateAndSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    const isDuplicate = existingProducts.some(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert('Validation Error', 'Product name already exists');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      price: parseFloat(price),
    };

    const updated = [...existingProducts, newProduct];
    await AsyncStorage.setItem('products', JSON.stringify(updated));
    Alert.alert('Success', 'Product added');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      {/* Placeholder for future image picker */}
      <TouchableOpacity style={styles.button} onPress={validateAndSubmit}>
        <Text style={styles.buttonText}>Save Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default AddProductScreen;
