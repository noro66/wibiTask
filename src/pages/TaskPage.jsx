import React, { useEffect, useState } from 'react'
import { Check, Plus, User, }         from 'lucide-react';
import Task from '../components/Task.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { useAuthStore }               from '../store/authStore.js'
import { useNavigate }                from 'react-router-dom'
import { useTaskStore }                  from '../store/taskStore.js'
import { hasPermission } from '../../public/constants/auth.js'

export default function TaskPage() {
  const { user, logout} = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchTasks()
  }, [])

  const {tasks, fetchTasks}  = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);


  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    // setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, title: taskData.title, note: taskData.description, assignee: taskData.assignee }
          : task
      ));
    } else {
      // Add new task
      const newTask = {
        id: Date.now(), // Simple ID generation
        title: taskData.title,
        note: taskData.description,
        assignee: taskData.assignee,
        completed: false
      };
      setTasks([...tasks, newTask]);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/images/Logo.svg" alt=""/>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium undel">{user?.username ?? user?.fullName?.split(' ')[0]}</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              onClick={()=> {
                logout();
                navigate('/login', {replace: true});
              }
              }
              >
                <User className="w-5 h-5 text-white" />
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
          <p className="text-gray-600">
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
          {hasPermission(user, 'create:task') && (<div className="bg-white border border-gray-200 rounded-lg p-4">
            <button
              onClick={handleAddNewTask}
              className="flex items-center gap-3 w-full text-left"
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