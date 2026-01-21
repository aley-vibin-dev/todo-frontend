import api from '@/api/api';

export interface DashboardStats {
  myResources: number;
}

interface BulkAssignedTasksPayload{
  resourceId: number;
  taskId: number;
}

interface TaskPayload {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  points: number;
}

interface ViewTasks {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  points: number;
}

interface BulkCreateTasksPayload {
  tasks: TaskPayload[];
}

interface BulkViewTasksPayload {
  tasks: ViewTasks[];
  deletedTasksIds: number[];
}

export interface Resources {
  id: number;
  name: string;
}

interface AssignTasks {
  Tasks: ViewTasks[];
  myResources: Resources[];

}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/manager/dashboard-stats');
  return data;
};

export const bulkCreateTasks = async (payload: BulkCreateTasksPayload) => {
  const { data } = await api.post('/manager/create-tasks', payload);
  return data;
};

export const getViewTasks = async (): Promise<ViewTasks[]> => {
  const { data } = await api.get('/manager/get-view-tasks');
  return data;
};

export const updateViewTasks = async (payload: BulkViewTasksPayload) => {
  try{
    await api.post('/manager/update-view-tasks', payload);
  }
  catch(err: any){
    console.log("Api Error: ", err.message);
  }
};

export const getAssignTasks = async (): Promise<AssignTasks> => {
  const { data } = await api.get('/manager/get-assign-tasks');
  return data;
};

export const updateAssignTasks = async (
  payload: BulkAssignedTasksPayload[]
) => {
  const { data } = await api.post('/manager/update-assign-tasks', payload);
  return data;
};