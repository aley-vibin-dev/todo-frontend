// src/config/adminSidebar.ts
export const getAdminSidebarItems = ({ pendingCount }: { pendingCount: number }) => [
  { key: 'home', label: 'Home', icon: '🏠', routeName: 'AdminHome' },
  { key: 'assign', label: 'Assign Resources', icon: '❔', routeName: 'AssignResources' },
  { key: 'approve', label: 'Approve Resources', icon: '✅', routeName: 'ApproveResources', badgeCount: pendingCount },
  { key: 'manage', label: 'Manage Resources', icon: '👨🏻‍💼', routeName: 'ManageResources' },
  { key: 'progress', label: 'Resources Progress', icon: '📈', routeName: 'ResourceProgress' },
];
