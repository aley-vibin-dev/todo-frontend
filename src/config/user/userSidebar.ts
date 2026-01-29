// src/config/userSidebar.ts
export const getUserSidebarItems = () => [
  { key: 'home', label: 'Home', icon: '🏠', routeName: 'UserHome' },
  { key: 'assigned', label: 'Assigned Tasks', icon: '❔', routeName: 'AssignedTasks' },
  { key: 'status', label: 'Tasks Status', icon: '✅', routeName: 'TasksStatus' },
];
