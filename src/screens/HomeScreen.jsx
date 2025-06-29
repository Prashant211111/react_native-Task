import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
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
  const productsData = [
    {
      id: 'a1',
      name: 'AKG N700NC M2 Wireless Headphones',
      price: '$199.00',
      image: require('../assets/headphone1.png'),
      available: true,
      category: 'products',
    },
    {
      id: 'a2',
      name: 'AIAIAI TMA-2 Modular Headphones',
      price: '$250.00',
      image: require('../assets/headphone2.png'),
      available: true,
      category: 'products',
    },
    {
      id: 'a3',
      name: 'AKG N700NC M2 Wirelss Headphones',
      price: '$199.00',
      image: require('../assets/headphone1.png'),
      available: true,
      category: 'products',
    },
    {
      id: 'a4',
      name: 'AIAIAI TMA-2 Modula Headphones',
      price: '$250.00',
      image: require('../assets/headphone2.png'),
      available: true,
      category: 'products',
    },
    {
      id: 'a5',
      name: 'AKG N700NC M2 Wireles Headphones',
      price: '$199.00',
      image: require('../assets/headphone1.png'),
      available: true,
      category: 'products',
    },
    {
      id: 'a6',
      name: 'AIAIAI TMA-2 Modular Headpones',
      price: '$250.00',
      image: require('../assets/headphone2.png'),
      available: true,
      category: 'products',
    },
  ];

  const accessoriesData = [
    {
      id: 'b1',
      name: 'AIAIAI 3.5mm Jack 2m',
      price: '$25.00',
      image: require('../assets/jack1.png'),
      available: true,
      category: 'accessories',
    },
    {
      id: 'b2',
      name: 'AIAIAI 3.5mm Jack 1.5m',
      price: '$15.00',
      image: require('../assets/jack2.png'),
      available: false,
      category: 'accessories',
    },
    {
      id: 'b3',
      name: 'AIAIAI 3.5mm Jack 2m',
      price: '$25.00',
      image: require('../assets/jack1.png'),
      available: true,
      category: 'accessories',
    },
    {
      id: 'b4',
      name: 'AIAIAI 3.5mm Jack 1.5m',
      price: '$15.00',
      image: require('../assets/jack2.png'),
      available: false,
      category: 'accessories',
    },
    {
      id: 'b5',
      name: 'AIAIAI 3.5mm Jack 2m',
      price: '$25.00',
      image: require('../assets/jack1.png'),
      available: true,
      category: 'accessories',
    },
    {
      id: 'b6',
      name: 'AIAIAI 3.5mm Jack 1.5m',
      price: '$15.00',
      image: require('../assets/jack2.png'),
      available: false,
      category: 'accessories',
    },
  ];

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  

  useEffect(() => {
    const fetchProducts = async () => {
      const stored = await AsyncStorage.getItem('products');
      let parsed = stored ? JSON.parse(stored) : [];

      // here i used Prefix  items to prevent same key errp
      parsed = parsed.map((item, index) => ({
        ...item,
        id: `u_${item.id || index}`,
      }));

      // Merge + remove duplicates by ID using Map
      const uniqueById = new Map();
      [...productsData, ...accessoriesData, ...parsed].forEach(item => {
        uniqueById.set(item.id, item);
      });

      setProducts(Array.from(uniqueById.values()));
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

  const handleDelete = id => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const updated = products.filter(item => item.id !== id);
          setProducts(updated);
          await AsyncStorage.setItem('products', JSON.stringify(updated));
        },
        style: 'destructive',
      },
    ]);
  };

  const filtered = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

 const filteredProducts = filtered.filter(item => item.category === 'products');
const filteredAccessories = filtered.filter(item =>item.category === 'accessories');
console.log("filtered :",filtered);
console.log("filteredProducts :",filteredProducts);
console.log("filteredAccessories",filteredAccessories);

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
      <Text style={styles.sectionTitle}>Products</Text>
      <FlatList
        data={filteredProducts}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.cardImage} />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDelete(item.id)}
              >
                <Icon name="delete" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text
                style={[
                  styles.cardAvailability,
                  { color: item.available ? 'green' : 'red' },
                ]}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Product Found</Text>
        }
      />
      <Text style={styles.sectionTitle}>accessories</Text>
      <FlatList
        data={filteredAccessories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.cardImage} />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDelete(item.id)}
              >
                <Icon name="delete" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text
                style={[
                  styles.cardAvailability,
                  { color: item.available ? 'green' : 'red' },
                ]}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Product Found</Text>
        }
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    margin: 10,
    width: 200, 
    alignItems: 'center',
  },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  imageContainer: {
      position: '',
    marginBottom: 5,
  },

  deleteIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(238, 232, 232, 0.18)',
    padding: 4,
    borderRadius: 12,
  },
  cardImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },

  cardContent: {
    padding: 10,
  },

  cardTitle: {
     fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  cardPrice: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },

  cardAvailability: {
    fontSize: 14,
    marginVertical: 5
  },
  emptyText: { textAlign: 'center',
    margin: 20,
    fontSize: 18,
    color: '#999', },
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
