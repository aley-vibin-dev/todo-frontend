export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'assigned' | 'submitted' | 'approved' | 'rejected' | 'completed';
  assigned_to?: number;
  created_by: number;
  points?: number;
  is_deleted: number;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  token?: string;
}
