import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Task {
  id: number;
  project_id: number;
  action: string;
  due_date: string;
  attachment?: string;
  attachments?: string[] | string;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  status_description?: string;
  scope: "task" | "project" | "invoice";
  assigned_to?: string;
  completed: boolean;
  action_plan?: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }
    
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const getProjectTasks = async (projectId: number): Promise<Task[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }
    
    // Update this URL to match your backend route
    const response = await axios.get(`${API_URL}/tasks/project/${projectId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    return [];
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    const response = await axios.post(`${API_URL}/tasks`, task, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<Task> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    const response = await axios.put(`${API_URL}/tasks/${task.id}`, task, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${task.id}:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};