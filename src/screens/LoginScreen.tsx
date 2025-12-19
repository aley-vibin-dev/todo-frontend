import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { AuthContext } from '@/context/AuthContext';
import { verifyInstallation } from 'nativewind';
// Note: `styled` helper is not exported in this nativewind version, avoid using it to prevent runtime errors.


export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      verifyInstallation();
    } catch (e: any) {
      console.warn('NativeWind verifyInstallation failed:', e.message ?? e);
      setError(e?.message ?? String(e));
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      const roles = user.roles || [];

      // Navigate based on roles - reset stack so user cannot go back to login
      if (roles.includes('admin')) {
        navigation.reset({ index: 0, routes: [{ name: 'Admin' }] });
      } else if (roles.includes('manager')) {
        navigation.reset({ index: 0, routes: [{ name: 'Manager' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'User' }] });
      }
    } catch (err: any) {
      setError(err?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
          
          {/* Header Section */}
          <View className="mt-16 mb-10">
            <Text className="text-3xl font-extrabold text-slate-900">Welcome Back</Text>
            <Text className="text-slate-500 text-lg mt-2">Sign in to continue your progress.</Text>
          </View>

          {/* Debug Section: compare styles */}
          <View className="mb-4">
            <Text style={{ color: '#ff0000', fontSize: 18, fontWeight: '700' }}>Inline style debug - should be visible</Text>
            <Text className="text-lg text-indigo-600 mt-2">className debug - should be indigo</Text>
          </View>

          {/* Form Section */}
          <View className="space-y-6">
            {error ? (
              <Text className="text-red-600 mb-2">{error}</Text>
            ) : null}

            <View>
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Email Address</Text>
              <TextInput
                className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-900 shadow-sm shadow-slate-200"
                placeholder="name@company.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mt-4">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Password</Text>
              <TextInput
                className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-900 shadow-sm shadow-slate-200"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity className="items-end mt-2">
              <Text className="text-indigo-600 font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              className={`w-full py-4 rounded-2xl mt-8 ${loading ? 'opacity-60' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="bg-indigo-600 text-white text-center text-lg font-bold py-4 rounded-2xl">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View className="flex-row justify-center mt-auto mb-8">
            <Text className="text-slate-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-indigo-600 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;