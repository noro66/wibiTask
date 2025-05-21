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
}))