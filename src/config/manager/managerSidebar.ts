// src/config/managerSidebar.ts
export const getManagerSidebarItems = () => [
  { key: 'home', label: 'Home', icon: '🏠', routeName: 'ManagerHome' },
  { key: 'create', label: 'Create Tasks', icon: '❔', routeName: 'CreateTasks' },
  { key: 'view', label: 'View Tasks', icon: '✅', routeName: 'ViewTasks' },
  { key: 'assign', label: 'Assign Tasks', icon: '👨🏻‍💼', routeName: 'AssignTasks' },
];
