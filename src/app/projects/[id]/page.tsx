'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { getProject, Project } from '@/lib/api/projectService';
import { getProjectTasks, Task, createTask, updateTask, deleteTask } from '@/lib/api/taskService';
import { getUsers, User } from '@/lib/api/userService';

export default function ProjectView() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState({
    action: '',
    due_date: '',
    attachments: [''],
    status_description: '',
    scope: 'project',
    assigned_to: '',
    status: 'not_started'
  });
  
  const [newTask, setNewTask] = useState<{
    action: string;
    due_date: string;
    attachments: string[];
    status_description: string;
    action_plan: string;
    scope: string;
    assigned_to: string;
    status: string;
  }>({
    action: '',
    due_date: '',
    attachments: [''],
    status_description: '',
    action_plan: '',
    scope: 'project',
    assigned_to: '',
    status: 'not_started'
  });
  
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTask({
      action: task.action,
      due_date: task.due_date || '',
      attachments: Array.isArray(task.attachments) ? task.attachments : (typeof task.attachments === 'string' ? (task.attachments as string).split(',') : ['']),
      status_description: task.status_description || '',
      scope: task.scope || 'project',
      assigned_to: task.assigned_to || '',
      status: task.status || 'not_started'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
        
        if (!id) {
          setLoading(false);
          return;
        }
        
        const projectData = await getProject(parseInt(id));
        const tasksData = await getProjectTasks(parseInt(id));
        const usersData = await getUsers();
        
        setProject(projectData);
        setTasks(tasksData); // Pastikan data task diambil dengan benar
        setUsers(usersData);
        
        console.log('Tasks loaded:', tasksData); // Tambahkan log untuk debugging
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [params]);

  const handleAddTask = () => {
    setShowAddTask(true);
  };
  
  const isTemporaryTask = (taskId: string | number): boolean => {
    if (typeof taskId === 'string') {
      return taskId.startsWith('temp-');
    }
    return false;
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttachmentChange = (index: number, value: string) => {
    const newAttachments = [...newTask.attachments];
    newAttachments[index] = value;
    setNewTask(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };

  const addAttachmentField = () => {
    setNewTask(prev => ({
      ...prev,
      attachments: [...prev.attachments, '']
    }));
  };

  const removeAttachmentField = (index: number) => {
    if (newTask.attachments.length > 1) {
      const newAttachments = [...newTask.attachments];
      newAttachments.splice(index, 1);
      setNewTask(prev => ({
        ...prev,
        attachments: newAttachments
      }));
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
      
      const taskData = {
        project_id: parseInt(id),
        action: newTask.action,
        due_date: newTask.due_date,
        attachment: newTask.attachments.join(','),
        attachments: newTask.attachments.join(','),
        status_description: newTask.status_description,
        scope: newTask.scope as "task" | "project" | "invoice",
        assigned_to: newTask.assigned_to,
        status: newTask.status as "not_started" | "in_progress" | "completed" | "blocked",
        completed: newTask.status === 'completed',
        action_plan: newTask.action_plan || ''
      };
      
      const createdTask = await createTask(taskData);
      
      setTasks(prev => [...prev.filter(t => !isTemporaryTask(t.id)), createdTask]);
      
      setNewTask({
        action: '',
        action_plan: '',
        due_date: '',
        attachments: [''],
        status_description: '',
        scope: 'project',
        assigned_to: '',
        status: 'not_started'
      });
      setShowAddTask(false);
      
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEditTask = async (taskId: number) => {
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
      await updateTask({
        ...editTask,
        id: taskId,
        project_id: parseInt(id),
        completed: editTask.status === 'completed',
        attachments: Array.isArray(editTask.attachments)
          ? editTask.attachments.join(',')
          : editTask.attachments,
        status: editTask.status as "not_started" | "in_progress" | "completed" | "blocked",
        scope: editTask.scope as "project" | "task" | "invoice"
      });
      setEditingTaskId(null);

      const tasksData = await getProjectTasks(parseInt(id));
      setTasks(tasksData);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center">Project not found</div>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTaskStatus = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'blocked':
        return 'Blocked';
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="flex space-x-2">
            <Link 
              href={`/projects/${params.id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Edit Project
            </Link>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Project Information</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.state)}`}>
                  {project.state}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Project Description</h3>
                  <p className="text-sm text-gray-600">{project.description || "No description provided"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Job Scope</h3>
                  <p className="text-sm text-gray-600">{project.job_scope || "No job scope specified"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Start Date</h3>
                  <p className="text-sm text-gray-600">{project.start_date || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">End Date</h3>
                  <p className="text-sm text-gray-600">{project.end_date || "Not specified"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">{project.progress || 0}% Complete</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Company Contact Person</h3>
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-sm">{project.contact_name || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm">{project.contact_email || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-sm">{project.contact_phone || "Not specified"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">ITS Technical Contact</h3>
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-sm">{project.tech_name || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm">{project.tech_email || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-sm">{project.tech_phone || "Not specified"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">ITS Administration Contact</h3>
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-sm">{project.admin_name || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm">{project.admin_email || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-sm">{project.admin_phone || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Tugas</h2>
              <button
                onClick={handleAddTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Tugas Baru
              </button>
            </div>
          </div>
          
          {showAddTask && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Tugas
                    </label>
                    <input
                      type="text"
                      id="action"
                      name="action"
                      value={newTask.action}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Masukkan nama tugas"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Jatuh Tempo
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={newTask.due_date}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1">
                      Ditugaskan Kepada
                    </label>
                    <select
                      id="assigned_to"
                      name="assigned_to"
                      value={newTask.assigned_to}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Pilih Pengguna</option>
                      {users.map(user => (
                        <option key={`user-${user.id}`} value={user.id.toString()}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newTask.status}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="not_started">Belum Dimulai</option>
                      <option value="in_progress">Sedang Berjalan</option>
                      <option value="completed">Selesai</option>
                      <option value="blocked">Terhambat</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Status
                  </label>
                  <textarea
                    id="status_description"
                    name="status_description"
                    value={newTask.status_description}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan deskripsi status"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label htmlFor="action_plan" className="block text-sm font-medium text-gray-700 mb-1">
                    Rencana Aksi
                  </label>
                  <textarea
                    id="action_plan"
                    name="action_plan"
                    value={newTask.action_plan}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan rencana aksi"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lampiran
                  </label>
                  {/* Pastikan semua map memiliki key yang unik */}
                  {newTask.attachments.map((attachment, index) => (
                    <div key={`new-attachment-${index}`} className="flex mb-2">
                      <input
                        type="text"
                        value={attachment}
                        onChange={(e) => handleAttachmentChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Masukkan URL lampiran"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachmentField(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-r-md"
                        disabled={newTask.attachments.length <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAttachmentField}
                    className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Lampiran Lain
                  </button>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Simpan Tugas
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="p-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tasks found for this project. Click Add New Task to create a task.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task, index) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{task.action}</div>
                          {task.action_plan && (
                            <div className="text-sm text-gray-500">{task.action_plan}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{task.due_date || "Not set"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusBadgeClass(task.status)}`}>
                            {formatTaskStatus(task.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {users.find(u => u.id.toString() === task.assigned_to)?.name || "Unassigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-blue-500 hover:text-blue-600 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};