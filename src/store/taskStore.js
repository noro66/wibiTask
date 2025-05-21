import {create} from 'zustand'
import api      from '../api/axios.js'
import { useAuthStore } from './authStore.js'
import { toast } from 'react-hot-toast'

export  const useTaskStore = create((set)=>({
  tasks: [],
  fetchTasks: async () => {
    const { user } = useAuthStore.getState();
    try {
      const response = await api.get('/tasks');
      const fetchedTasks = response.data || [];

      // Filter tasks based on user role
      const filteredTasks = user.role !== "admin"
        ? fetchedTasks.filter(task => task?.assignedTo === user.username)
        : fetchedTasks;
      
      set({ tasks: filteredTasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error(error?.response?.data?.error || 'Failed to fetch tasks');
    }
  },
  createTask: async (task)=>{
    try{
      const response = await api.post('/tasks', task);
      const newTask = response.data;
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      toast.success('Task created successfully');
    }catch (error){
      console.error('Error creating task:', error);
      toast.error(error?.response?.data?.error || 'Failed to create task');
    }
  },
  updateTask: async (taskId, updatedTask) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updatedTask);
      const newTask = response.data;
      set((state) => ({
        tasks: state.tasks.map(task => (task.id === taskId ? newTask : task))
      }));
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error?.response?.data?.error || 'Failed to update task');
    }
  },
  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error?.response?.data?.error || 'Failed to delete task');
    }
  },
}))