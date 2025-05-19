import { create } from 'zustand'
import api        from '../api/axios.js'
import { toast }  from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  users: [],
  login: async (data) => {
    try{
      const {username, password} = data;
      const response = await api.post('/login',{username, password});
      const {user} = response.data;
      const token  = user.token;
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

    }catch (error){
      toast.error(error?.response?.data?.error || 'An error occurred');
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
  getUsers: async()=>{
    try{
      const response = await  api.get('/users');
      const fetchedUsers = response?.data;
      const filteredUsers = fetchedUsers.filter(user => user.role !== 'admin');

      console.log('users', fetchedUsers);

      set({users : filteredUsers})
    }catch (error){
      console.log(error?.response?.data?.error);
    }
  }
}))