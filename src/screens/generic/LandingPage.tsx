import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';

export const LandingPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, [scaleAnim, fadeAnim]);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-1 items-center justify-between py-16 px-8">
        
        {/* Top Section: Logo & Branding */}
        <Animated.View 
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          className="items-center mt-10"
        >
          
          <Text className="text-3xl font-extrabold mt-8 tracking-wide p-4 bg-blue-100" 
          style={{borderWidth: 1, 
            borderColor: '#3B82F6',
            borderRadius: 10,
            shadowColor: '#005aeaff',           // white shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 30,
            elevation: 30,  }}>
            <Text className="text-indigo-600">Cop</Text>
            <Text className="text-green-600">Ops</Text>
          </Text>


          <Text className="text-slate-500 text-center mt-10 text-lg px-4">
            Master your tasks with precision and security.
          </Text>

          <Text className="text-slate-400 text-center mt-60 text-medium px-4">
            Powered By
          </Text>

          <View className="bg-white px-8 mt-4 rounded-3xl shadow-xl shadow-slate-300">
            <Image
              source={require('@/../assets/codingcops-logo.png')} 
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Bottom Section: Action Buttons */}
        <View className="w-full space-y-4 mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-indigo-600 w-full py-4 rounded-2xl shadow-lg shadow-indigo-300"
            onPress={() => navigation.navigate('Login', {})}
          >
            <Text className="text-white text-center text-lg font-bold">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-white border border-slate-200 w-full py-4 rounded-2xl"
            onPress={() => navigation.navigate('Signup')}
          >
            <Text className="text-indigo-600 text-center text-lg font-bold">
              Create Account
            </Text>
          </TouchableOpacity>

          <Text className="text-slate-400 text-center text-sm mt-4">
            v1.0.0 — Secured by CodingCops
          </Text>
        </View>

      </View>
    </View>
  );
};