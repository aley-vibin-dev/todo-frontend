import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { ManagerSidebar } from './ManagerSidebar';
import { ManagerNavbar } from './ManagerNavbar';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.2;

export const ManagerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => setCollapsed(prev => !prev);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: collapsed ? 0 : SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(contentAnim, {
        toValue: collapsed ? 0 : SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [collapsed]);

  return (
    <View className="flex-1 flex-row">
      {/* Sidebar */}
      <Animated.View style={{ width: sidebarAnim }}>
        <ManagerSidebar collapsed={collapsed} />
      </Animated.View>

      {/* Main Area */}
      <Animated.View style={{ flex: 1, marginLeft: contentAnim }}>
        {/* Hamburger Button */}
        <TouchableOpacity
          onPress={toggleSidebar}
          className="absolute top-4 left-4 z-10 bg-gray-300 p-2 rounded"
        >
          <Text className="text-lg font-bold">{collapsed ? '☰' : '✕'}</Text>
        </TouchableOpacity>

        {/* Navbar */}
        <ManagerNavbar />

        {/* Content */}
        <View className="flex-1 p-4">
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
