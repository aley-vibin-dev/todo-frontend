import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { getPendingResources, PendingResources } from '@/services/admin';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SIDEBAR = {
  COLLAPSED: 0,
  EXPANDED: SCREEN_WIDTH * 0.5,
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const [pendingCount, setPendingCount] = useState(0); // ← count of pending approvals

  const sidebarWidth = useRef(new Animated.Value(SIDEBAR.COLLAPSED)).current;

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const closeAll = () => {
    if (!collapsed) setCollapsed(true);
    if (showDropdown) setShowDropdown(false);
  };

  // Animate sidebar width
  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: collapsed ? SIDEBAR.COLLAPSED : SIDEBAR.EXPANDED,
      duration: 0,
      useNativeDriver: false,
    }).start();

    if (!collapsed) setShowDropdown(false);
  }, [collapsed]);

  const hamburgerLeft = sidebarWidth.interpolate({
    inputRange: [SIDEBAR.COLLAPSED, SIDEBAR.EXPANDED],
    outputRange: [12, SIDEBAR.EXPANDED - 40],
    extrapolate: 'clamp',
  });

  // Fetch pending resources and update count
  const fetchPendingCount = useCallback(async () => {
    try {
      const data: PendingResources[] = await getPendingResources();
      setPendingCount(data.length);
    } catch (err) {
      console.error('Failed to fetch pending resources:', err);
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    if (!collapsed) {
      fetchPendingCount();
    }
  }, [collapsed, fetchPendingCount]);


  // Fetch once on mount, and optionally you could refresh periodically
  useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar */}
        <Animated.View style={{ width: sidebarWidth }}>
          <AdminSidebar
            collapsed={collapsed}
            sidebarWidth={sidebarWidth}
            pendingCount={pendingCount} // ← pass the dynamically fetched count
          />
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
          <TouchableOpacity onPress={toggleSidebar} activeOpacity={0.7}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
              <View style={{ height: 2, width: 24, backgroundColor: 'white', borderRadius: 1, marginBottom: 4 }} />
              <View style={{ height: 2, width: collapsed ? 24 : 14, backgroundColor: 'white', borderRadius: 1, marginBottom: 4 }} />
              <View style={{ height: 2, width: collapsed ? 24 : 8, backgroundColor: 'white', borderRadius: 1 }} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Main content */}
        <View style={{ flex: 1 }}>
          <AdminNavbar
            collapsed={collapsed}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />

          <TouchableWithoutFeedback onPress={closeAll}>
            <View style={{ flex: 1 }}>{children}</View>
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
        </View>
      </View>
    </View>
  );
};
