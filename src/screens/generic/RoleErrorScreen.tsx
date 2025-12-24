import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';

export const RoleErrorScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center px-6">
      <View className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-300">
        
        {/* Icon */}
        <Text className="text-5xl text-center mb-4">🚫</Text>

        {/* Title */}
        <Text className="text-2xl font-extrabold text-slate-900 text-center mb-2">
          Access Pending
        </Text>

        {/* Message */}
        <Text className="text-slate-600 text-center mb-6 leading-relaxed">
          Your account has been created successfully, but no role has been
          assigned yet.
          {'\n\n'}
          Please contact an administrator to activate your access.
        </Text>

        {/* Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Landing')}
          className="bg-indigo-600 py-4 rounded-2xl shadow-md shadow-indigo-300"
        >
          <Text className="text-white text-center text-lg font-bold">
            Go to Home
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
