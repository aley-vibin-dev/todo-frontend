import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import {RouteProp, useRoute} from '@react-navigation/native'

export const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Login'>>();
  const sessionout_error = route.params?.sessionout_error ?? false;

  useEffect(() => {
    if (sessionout_error === true) {
      setError('Your session has expired. Please login again.');
      
      navigation.setParams({ sessionout_error: undefined } as any);
    }
  }, [sessionout_error]);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await loginUser(email, password);

      login(data.token, data.user);

      // Navigate based on role
      if (data.user.roles[0] === 'admin') navigation.navigate('Admin');
      else if (data.user.roles[0] === 'manager') navigation.navigate('Manager');
      else if (data.user.roles[0] === 'user') navigation.navigate('User');
      else navigation.navigate('RoleError');
    } catch (err: any) {
      setError(
        err?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center px-6">
      
      {/* Title */}
      <Text className="text-3xl font-extrabold text-slate-900 mb-6 text-center">
        Sign In
      </Text>

      {/* Card */}
      <View className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-300">
        
        {error && (
          <Text className="text-red-500 mb-4">{error}</Text>
        )}

        {/* Email Field */}
        <Text className="text-sm font-medium text-slate-600 mb-2 ml-1">
          Email Address
        </Text>
        <TextInput
          placeholder="zaeem@codingcops.com"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 mb-4 text-slate-900"
        />

        {/* Password Field */}
        <Text className="text-sm font-medium text-slate-600 mb-2 ml-1">
          Password
        </Text>
        <View className="relative mb-4">
          <TextInput
            placeholder="Enter your password"
            value={password}
            autoCapitalize='none'
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 pr-12 text-slate-900"
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowPassword(prev => !prev)}
          >
            <Text className="text-slate-400">
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          className="mb-4"
        >
          <Text className="text-indigo-600 text-right text-sm font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-indigo-600 py-4 rounded-2xl mb-2 shadow-md shadow-indigo-300"
        >
          <Text className="text-white text-center text-lg font-bold">
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* Footer */}
      <Text className="text-slate-400 text-center text-sm mt-6">
        Powered by CodingCops
      </Text>
    </SafeAreaView>
  );
};
