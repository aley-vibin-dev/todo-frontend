import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SIDEBAR = {
  COLLAPSED: 0,
  EXPANDED: SCREEN_WIDTH * 0.5,
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true); // sidebar state
  const [showDropdown, setShowDropdown] = useState(false); // dropdown state

  const sidebarWidth = useRef(new Animated.Value(SIDEBAR.COLLAPSED)).current;

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const closeAll = () => {
    if (!collapsed) setCollapsed(true);
    if (showDropdown) setShowDropdown(false);
  };

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: collapsed ? SIDEBAR.COLLAPSED : SIDEBAR.EXPANDED,
      duration: 0,
      useNativeDriver: false,
    }).start();

    // auto-close dropdown when sidebar expands
    if (!collapsed) setShowDropdown(false);
  }, [collapsed]);

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

      {/* Hamburger */}
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
            <View
              className="bg-white h-0.5 rounded"
              style={{ width: collapsed ? '100%' : '50%' }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main content */}
      <Animated.View style={{ flex: 1 }}>
        <AdminNavbar
          collapsed={collapsed}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />

        {/* Click-outside to close */}
        <TouchableWithoutFeedback onPress={closeAll}>
          <View className="flex-1">{children}</View>
        </TouchableWithoutFeedback>

        {/* Dim overlay */}
        {!collapsed && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.15)',
            }}
          />
        )}
      </Animated.View>
    </View>
  );
};
