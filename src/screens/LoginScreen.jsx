import React, { useEffect, useState } from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('pistol');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) navigation.replace('HomeScreen');
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

   const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Image
         source={require('../assets/logistic.png')}
          style={styles.img}
          resizeMode="contain"
          
        />
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
       <MaterialIcons name="alternate-email" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      </View>
       <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={secureTextEntry}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Entypo
            name={secureTextEntry ? 'eye-with-line' : 'eye'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
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
      <Text style={styles.or}>OR</Text>
       <TouchableOpacity style={styles.googleButton}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
          }}
          style={styles.googleIcon}
          accessibilityLabel="Google logo"
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text>New to Logistics? </Text>
        <TouchableOpacity>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#091334',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#091334',
    paddingVertical: 0,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#2055f7',
    textAlign: 'right',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  img: {
       width: 240,
    height: 160,
     alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#cbd5e1',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
   eyeIcon: {
    padding: 4,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 28,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#485063',
  fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#2055f7',
    fontWeight: '700',
  },
});

export default LoginScreen;
