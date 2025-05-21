import React, { useEffect, useState } from 'react'
import { Check, Plus, User, }         from 'lucide-react';
import Task from '../components/Task.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { useAuthStore }               from '../store/authStore.js'
import { useNavigate }                from 'react-router-dom'
import { useTaskStore }  from '../store/taskStore.js'
import { hasPermission } from '../constants/roles.js'

export default function TaskPage() {
  const { user, logout} = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchTasks()
  }, []);

  const {tasks, fetchTasks, createTask, updateTask, deleteTask}  = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);


  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTask = { ...task, status: 'done' };
    await updateTask(taskId, updatedTask);
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Update existing task
      console.log({editingTask})
      await updateTask(editingTask.id, taskData);
    } else {
      // Add new task
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo,
        status: 'in_progress',
      };
      await createTask(newTask);
    }
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const pendingTasks = tasks.filter(task => task.status !== 'done');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/images/Logo.svg" alt=""/>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-semibold undel">{user?.username ?? user?.fullName?.split(' ')[0]}</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              onClick={()=> {
                logout();
                navigate('/login', {replace: true});
              }
              }
              >
                <img src={user.role === 'admin' ? '/images/admin-avatar.svg' : "/image/normal-user-avatar.svg"} alt=""/>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, <span className="text-blue-500">{user?.username ?? user?.firstName.split(' ')[0]}</span>.
          </h1>
          <p className="text-[#8D9CB8] font-medium text-lg">
            Your {user.role === 'admin' ? 'team' : "'ve"} got {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} to do.
          </p>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          {tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}

          {/* Add New Task */}
          {hasPermission(user, 'create:task') && (<div className="font-semibold text-l rounded-lg p-4">
            <button
              onClick={handleAddNewTask}
              className="flex items-center gap-3 w-full text-left cursor-pointer"
            >
              <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-500">Add a new task...</span>
            </button>
          </div>)}
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </main>
    </div>
  );
}