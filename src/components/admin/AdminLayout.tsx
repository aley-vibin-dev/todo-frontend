import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SIDEBAR = {
  COLLAPSED: 0,
  EXPANDED: SCREEN_WIDTH * 0.5,
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  const sidebarWidth = useRef(
    new Animated.Value(SIDEBAR.COLLAPSED)
  ).current;

  const toggleSidebar = () => setCollapsed(prev => !prev);

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: collapsed ? SIDEBAR.COLLAPSED : SIDEBAR.EXPANDED,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [collapsed]);

  /**
   * Derived animated values
   */
  const hamburgerLeft = sidebarWidth.interpolate({
    inputRange: [SIDEBAR.COLLAPSED, SIDEBAR.EXPANDED],
    outputRange: [12, SIDEBAR.EXPANDED - 40],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 flex-row">
      {/* Sidebar */}
      <Animated.View style={{ width: sidebarWidth }}>
        <AdminSidebar collapsed={collapsed} sidebarWidth={sidebarWidth} />
      </Animated.View>

      {/* Hamburger button */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 70,
          left: hamburgerLeft,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity onPress={toggleSidebar}>
          <View>
            {collapsed && <View className="bg-white h-0.5 w-6 rounded" />}
            <View className="bg-white h-0.5 w-6 rounded my-1" />
            <View className="bg-white h-0.5 rounded" style={{width: collapsed? '100%' : '50%'}}/>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main content */}
      <Animated.View style={{ flex: 1 }}>
        <AdminNavbar collapsed={collapsed} />
        <View className="flex-1">
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
