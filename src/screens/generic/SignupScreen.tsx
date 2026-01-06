import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { signupUser } from '@/services/auth';

export const SignupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signupUser(name, email, password);

      // Clear form after successful signup
      setName('');
      setEmail('');
      setPassword('');

      // Navigate to Login
      navigation.navigate('Login', { sessionout_error: false });
    } catch (err: any) {
      // Handle specific email-in-use error
      if (err.message === 'Email is already in use') {
        setError(
          'This email is already registered. Please login or use another email.'
        );
        setEmail('');
        setPassword('');
      } else {
        setError(err?.message || 'Signup failed');
      }
    } finally {
      setLoading(false); // ensures button is re-enabled
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-6 justify-center">

          {/* Header */}
          <View className="mb-10">
            <Text className="text-3xl font-extrabold text-slate-900">
              Create Account
            </Text>
            <Text className="text-slate-500 mt-2 text-base">
              Join CodingCops and start organizing your work.
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          {/* Form */}
          <View className="space-y-4">
            <TextInput
              placeholder="Full Name"
              value={name}
              autoCapitalize='words'
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
              className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
            />

            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
              className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#94a3b8"
              className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900"
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSignup}
            disabled={loading}
            className="bg-indigo-600 mt-8 py-4 rounded-2xl shadow-lg shadow-indigo-300"
          >
            <Text className="text-white text-center text-lg font-bold">
              {loading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-500">Already have an account? go to</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login', { sessionout_error: false })}
            >
              <Text className="text-blue-600 font-bold ml-1">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
