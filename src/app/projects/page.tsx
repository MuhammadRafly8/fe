'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { getProjects, deleteProject, Project } from '@/lib/api/projectService';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define Task interface
interface Task {
  id: number;
  project_id: number;
  action: string;
  due_date: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  assigned_to: string;
  scope: 'task' | 'project' | 'invoice';
  completed: boolean;
  status_description?: string;
  deleted?: boolean;
}

// Mock functions for task management (replace with actual API calls)
const getProjectTasks = async (projectId: number): Promise<Task[]> => {
  // This would be replaced with an actual API call
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 1,
        project_id: projectId,
        action: 'Design database schema',
        due_date: '2023-12-15',
        status: 'in_progress',
        assigned_to: 'John Doe',
        scope: 'project',
        completed: false
      },
      {
        id: 2,
        project_id: projectId,
        action: 'Implement user authentication',
        due_date: '2023-12-20',
        status: 'not_started',
        assigned_to: 'Jane Smith',
        scope: 'task',
        completed: false
      }
    ];
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }
};

const updateTask = async (task: Task): Promise<Task> => {
  // This would be replaced with an actual API call
  try {
    console.log('Updating task:', task);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

const createTask = async (task: Partial<Task>): Promise<Task> => {
  // This would be replaced with an actual API call
  try {
    console.log('Creating task:', task);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: Math.floor(Math.random() * 1000),
      project_id: task.project_id || 0,
      action: task.action || '',
      due_date: task.due_date || '',
      status: task.status || 'not_started',
      assigned_to: task.assigned_to || '',
      scope: task.scope || 'task',
      completed: task.completed || false,
      status_description: task.status_description
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Task Item Component with Drag and Drop
const TaskItem = ({ task, index, moveTask, updateTaskHandler }: { 
  task: Task, 
  index: number, 
  moveTask: (dragIndex: number, hoverIndex: number) => void,
  updateTaskHandler: (taskId: number, updatedFields: Partial<Task>) => void
}) => {
  const ref = useRef<HTMLTableRowElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }
      
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  
  drag(drop(ref));
  
  // Function to handle task deletion
  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Mark the task for deletion by setting a special flag
      updateTaskHandler(task.id, { deleted: true });
    }
  };
  
  return (
    <tr 
      ref={ref} 
      className={`border-b hover:bg-gray-50 ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move' }}
    >
      <td className="px-4 py-3">
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
          value={task.scope}
          onChange={(e) => updateTaskHandler(task.id, { scope: e.target.value as 'task' | 'project' | 'invoice' })}
        >
          <option value="task">Task</option>
          <option value="project">Project</option>
          <option value="invoice">Invoice</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input 
          type="text" 
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
          defaultValue={task.action}
          onBlur={(e) => updateTaskHandler(task.id, { action: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
          value={task.assigned_to || ''}
          onChange={(e) => updateTaskHandler(task.id, { assigned_to: e.target.value })}
        >
          <option value="">Select Member</option>
          <option value="John Doe">John Doe</option>
          <option value="Jane Smith">Jane Smith</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
          value={task.status}
          onChange={(e) => updateTaskHandler(task.id, { 
            status: e.target.value as 'not_started' | 'in_progress' | 'completed' | 'blocked' 
          })}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input 
          type="text" 
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
          defaultValue={task.status_description || ''}
          onBlur={(e) => updateTaskHandler(task.id, { status_description: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <input 
          type="date" 
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
          value={task.due_date || ''}
          onChange={(e) => updateTaskHandler(task.id, { due_date: e.target.value })}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => updateTaskHandler(task.id, { status: 'completed' })}
            className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
            title="Mark as completed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button 
            onClick={handleDeleteTask}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [projectTasks, setProjectTasks] = useState<{[key: number]: Task[]}>({});
  const [showAddTask, setShowAddTask] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    action: '',
    due_date: '',
    attachments: [''],
    status_description: '',
    scope: 'project',
    assigned_to: '',
    status: 'not_started'
  });
  const router = useRouter();

  // Replace the useEffect with this improved version
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects...');
        const data = await getProjects();
        console.log('Projects fetched:', data);
        setProjects(data || []); // Ensure we always have an array
        setLoading(false);
      } catch (error) {
        console.error('Error in component while fetching projects:', error);
        setProjects([]); // Set empty array on error
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Replace the handleDelete function with this
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        // Remove the deleted project from the state
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const toggleProjectDetails = async (projectId: number) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
      
      // Fetch tasks for this project if not already loaded
      if (!projectTasks[projectId]) {
        try {
          const tasks = await getProjectTasks(projectId);
          setProjectTasks(prev => ({
            ...prev,
            [projectId]: tasks
          }));
        } catch (error) {
          console.error('Error fetching project tasks:', error);
          setProjectTasks(prev => ({
            ...prev,
            [projectId]: []
          }));
        }
      }
    }
  };

  const handleAddTask = (projectId: number) => {
    setShowAddTask(projectId);
    setNewTask({
      action: '',
      due_date: '',
      attachments: [''],
      status_description: '',
      scope: 'project',
      assigned_to: '',
      status: 'not_started'
    });
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

  const handleTaskSubmit = async (projectId: number, e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        project_id: projectId,
        action: newTask.action,
        due_date: newTask.due_date,
        status_description: newTask.status_description,
        scope: newTask.scope,
        assigned_to: newTask.assigned_to,
        status: newTask.status,
        completed: newTask.status === 'completed'
      };
      
      const createdTask = await createTask({
        ...taskData,
        status: taskData.status as 'not_started' | 'in_progress' | 'completed' | 'blocked',
        scope: taskData.scope as 'task' | 'project' | 'invoice'
      });
      
      // Update the tasks list for this project
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), createdTask]
      }));
      
      // Reset form and close it
      setNewTask({
        action: '',
        due_date: '',
        attachments: [''],
        status_description: '',
        scope: 'project',
        assigned_to: '',
        status: 'not_started'
      });
      setShowAddTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (projectId: number, taskId: number, updatedFields: Partial<Task>) => {
    try {
      const taskToUpdate = projectTasks[projectId].find(task => task.id === taskId);
      
      if (!taskToUpdate) return;
      
      // If the task is marked for deletion, remove it from the list
      if (updatedFields.deleted) {
        setProjectTasks(prev => ({
          ...prev,
          [projectId]: prev[projectId].filter(task => task.id !== taskId)
        }));
        return;
      }
      
      const updatedTask = await updateTask({
        ...taskToUpdate,
        ...updatedFields,
        completed: updatedFields.status === 'completed' || taskToUpdate.status === 'completed'
      });
      
      // Update the tasks list for this project
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: prev[projectId].map(task => 
          task.id === taskId ? updatedTask : task
        )
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const moveTask = (projectId: number, dragIndex: number, hoverIndex: number) => {
    const tasks = [...projectTasks[projectId]];
    const draggedTask = tasks[dragIndex];
    
    // Remove the dragged task from the array
    tasks.splice(dragIndex, 1);
    // Insert it at the new position
    tasks.splice(hoverIndex, 0, draggedTask);
    
    // Update the state
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: tasks
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8"> {/* Added ml-64 to offset the sidebar width */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link href="/projects/create" className="block">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">
              Create New Project
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search for projects"
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {loading ? (
              <div className="text-center py-4">Loading projects...</div>
            ) : (
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No projects found</div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Project Header */}
                      <div 
                        className="bg-white p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                        onClick={() => toggleProjectDetails(project.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="mr-2">
                              <span className={`inline-block w-3 h-3 rounded-full ${
                                project.state === 'Ongoing Project' ? 'bg-green-500' : 
                                project.state === 'Completed' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}></span>
                            </div>
                            <h3 className="text-lg font-medium">{project.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{project.state}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/projects/${project.id}/edit`);
                            }}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/projects/${project.id}`);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                            className="text-red-600 hover:text-red-900 px-2 py-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Project Details */}
                      {expandedProject === project.id && (
                        <div className="border-t border-gray-200">
                          {/* Project Information */}
                          <div className="p-4 bg-gray-50">
                            <h4 className="text-md font-medium mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Project Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="mb-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">DETAILS</h5>
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <div className="mb-2">
                                      <div className="text-xs text-gray-500">Project Description</div>
                                      <div className="text-sm">{project.description || 'No description'}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-xs text-gray-500">Start Date</div>
                                        <div className="text-sm">{project.start_date}</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500">End Date</div>
                                        <div className="text-sm">{project.end_date}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="mb-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">JOB SCOPE</h5>
                                  <div className="bg-white p-3 rounded border border-gray-200 flex space-x-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Invoice</span>
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Project</span>
                                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">Task</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tasks */}
                          <div className="p-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-md font-medium flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Tasks
                              </h4>
                              <button 
                                onClick={() => handleAddTask(project.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Task
                              </button>
                            </div>

                            {/* Task List with Drag and Drop */}
                            <DndProvider backend={HTML5Backend}>
                              <div className="overflow-x-auto">
                                <table className="min-w-full table-auto border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SCOPE</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIVITIES</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEMBER</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS DESCRIPTION</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DUE DATE</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {!projectTasks[project.id] || projectTasks[project.id].length === 0 ? (
                                      <tr>
                                        <td colSpan={7} className="px-4 py-3 text-center text-sm text-gray-500">No tasks found for this project</td>
                                      </tr>
                                    ) : (
                                      projectTasks[project.id].map((task, index) => (
                                        <TaskItem 
                                          key={task.id}
                                          task={task}
                                          index={index}
                                          moveTask={(dragIndex, hoverIndex) => moveTask(project.id, dragIndex, hoverIndex)}
                                          updateTaskHandler={(taskId, updatedFields) => handleUpdateTask(project.id, taskId, updatedFields)}
                                        />
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </DndProvider>

                            {/* Add Task Form */}
                            {showAddTask === project.id && (
                              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                <h5 className="text-md font-medium mb-3">Add New Task</h5>
                                <form onSubmit={(e) => handleTaskSubmit(project.id, e)} className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                                        Scope
                                      </label>
                                      <select
                                        id="scope"
                                        name="scope"
                                        value={newTask.scope}
                                        onChange={handleTaskChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                      >
                                        <option value="invoice">Invoice</option>
                                        <option value="project">Project</option>
                                        <option value="task">Task</option>
                                      </select>
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                                        Activities
                                      </label>
                                      <input
                                        type="text"
                                        id="action"
                                        name="action"
                                        value={newTask.action}
                                        onChange={handleTaskChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter activities"
                                        required
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1">
                                        Member
                                      </label>
                                      <select
                                        id="assigned_to"
                                        name="assigned_to"
                                        value={newTask.assigned_to}
                                        onChange={handleTaskChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                      >
                                        <option value="">Select Member</option>
                                        <option value="John Doe">John Doe</option>
                                        <option value="Jane Smith">Jane Smith</option>
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
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="blocked">Blocked</option>
                                      </select>
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="status_description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status Description
                                      </label>
                                      <input
                                        type="text"
                                        id="status_description"
                                        name="status_description"
                                        value={newTask.status_description}
                                        onChange={handleTaskChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter status description"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
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
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Attachments
                                    </label>
                                    {newTask.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-center mb-2">
                                        <input
                                          type="text"
                                          value={attachment}
                                          onChange={(e) => handleAttachmentChange(index, e.target.value)}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md mr-2"
                                          placeholder="Enter attachment URL or description"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeAttachmentField(index)}
                                          className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                                          disabled={newTask.attachments.length <= 1}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={addAttachmentField}
                                      className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                      Add Attachment
                                    </button>
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setShowAddTask(null)}
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                      Save Task
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}