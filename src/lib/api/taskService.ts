import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Task {
  id: number;
  project_id: number;
  action: string;
  due_date: string;
  attachment: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
  status_description?: string;
  scope?: string;
  assigned_to?: string;
  status?: string;
}

export interface CreateTaskData {
  project_id: number;
  action: string;
  due_date?: string;
  attachment?: string;
  status_description?: string;
  scope?: string;
  assigned_to?: string;
  status?: string;
  completed?: boolean;
}

// Mock data for development
const mockTasks: Task[] = [
  {
    id: 1,
    project_id: 1,
    action: 'Membuat laporan',
    due_date: '2023-04-01',
    attachment: 'www.google.com',
    completed: true,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-20T00:00:00Z'
  },
  {
    id: 2,
    project_id: 1,
    action: 'Mengupdate laporan',
    due_date: '2023-04-03',
    attachment: 'www.google.com',
    completed: true,
    created_at: '2023-01-25T00:00:00Z',
    updated_at: '2023-01-30T00:00:00Z'
  },
  {
    id: 3,
    project_id: 1,
    action: 'Membuat UI/UX',
    due_date: '',
    attachment: '',
    completed: false,
    created_at: '2023-02-05T00:00:00Z',
    updated_at: '2023-02-05T00:00:00Z'
  },
  {
    id: 4,
    project_id: 1,
    action: 'Membuat database',
    due_date: '',
    attachment: '',
    completed: false,
    created_at: '2023-02-10T00:00:00Z',
    updated_at: '2023-02-10T00:00:00Z'
  }
];

// Get tasks for a project
export const getProjectTasks = async (projectId: number): Promise<Task[]> => {
  try {
    // For development, return mock data
    return mockTasks.filter(task => task.project_id === projectId);
    
    /* Uncomment when backend is ready
    const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`);
    return response.data;
    */
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    return mockTasks.filter(task => task.project_id === projectId);
  }
};

// Create a new task
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  try {
    // For development, simulate API call
    console.log('Creating task with data:', taskData);
    const newTask: Task = {
      id: mockTasks.length + 1,
      ...taskData,
      due_date: taskData.due_date || '',
      attachment: taskData.attachment || '',
      completed: taskData.completed || false,
      status_description: taskData.status_description || '',
      scope: taskData.scope || 'project',
      assigned_to: taskData.assigned_to || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return newTask;
    
    /* Uncomment when backend is ready
    const response = await axios.post(`${API_URL}/projects/${taskData.project_id}/tasks`, taskData);
    return response.data;
    */
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task
// Tambahkan fungsi updateTask
export const updateTask = async (taskData: Task): Promise<Task> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Mock implementation for development
      const index = mockTasks.findIndex(task => task.id === taskData.id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...taskData, updated_at: new Date().toISOString() };
        return mockTasks[index];
      }
      throw new Error('Task not found');
    }

    const response = await fetch(`/api/tasks/${taskData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    // For development, simulate API call
    console.log(`Deleting task ${taskId}`);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    mockTasks.splice(taskIndex, 1);
    
    /* Uncomment when backend is ready
    await axios.delete(`${API_URL}/tasks/${taskId}`);
    */
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};