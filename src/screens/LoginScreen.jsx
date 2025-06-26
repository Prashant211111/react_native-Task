import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('pistol');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) navigation.replace('Home');
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
     setLoading(true);
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'reqres-free-v1',
  },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        await AsyncStorage.setItem('token', data.token);
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert(Error, 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
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

export default LoginScreen;
