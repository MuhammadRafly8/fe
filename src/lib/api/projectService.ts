import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Project {
  technical_name: string;
  administrator_email: string;
  administrator_phone: string;
  technical_contact: unknown;
  id: number;
  name: string;
  description: string;
  job_scope: string;
  scope: string;
  status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_contact_name: string;
  company_contact_email: string;
  company_contact_phone: string;
  tech_name: string;
  tech_email: string;
  tech_phone: string;
  technical_contact_name: string;
  technical_contact_email: string;
  technical_contact_phone: string;
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  admin_contact_name: string;
  admin_contact_email: string;
  admin_contact_phone: string;
  state: string;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  job_scope: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  tech_name: string;
  tech_email: string;
  tech_phone: string;
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  state: string;
  start_date: string;
  end_date: string;
}

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }
    
    const response = await axios.get(`${API_URL}/projects`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Get a single project by ID
export const getProject = async (id: number): Promise<Project> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    console.log(`Fetching project with ID: ${id}`);
    
    const response = await axios.get(`${API_URL}/projects/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Project data received:', response.data);
    
    if (!response.data) {
      throw new Error('No data returned from server');
    }
    
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching project with ID ${id}:`, error);
    
    // Add more detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData: CreateProjectData): Promise<Project> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    // Send the complete project data directly
    const response = await axios.post(`${API_URL}/projects`, projectData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data.project || response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (id: number, projectData: Partial<Project>): Promise<Project> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    const response = await axios.put(`${API_URL}/projects/${id}`, projectData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }
    
    await axios.delete(`${API_URL}/projects/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};