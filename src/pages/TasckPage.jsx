import React, { useState } from 'react';
import { Check, Edit, Trash2, Plus, User } from 'lucide-react';

// Separate Task Component
const Task = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500 text-sm font-medium">@{task.assignee}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
          <p className="text-gray-500 text-sm">{task.note}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task.id)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit task"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              task.completed
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {task.completed ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Completed
              </span>
            ) : (
              'Done'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function TaskDashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Task 01',
      note: 'Note: Add relevant details, blockers, or context for this task here.',
      assignee: 'User',
      completed: false
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleEditTask = (taskId) => {
    // Handle edit functionality
    console.log('Edit task:', taskId);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        note: 'Note: Add relevant details, blockers, or context for this task here.',
        assignee: 'User',
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="text-xl font-semibold text-gray-900">Taski</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Admin</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
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
            Welcome, <span className="text-blue-500">Admin</span>.
          </h1>
          <p className="text-gray-600">
            Your team got {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} to do.
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
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Add a new task..."
                className="flex-1 text-gray-500 bg-transparent border-none outline-none placeholder-gray-400"
              />
              {newTaskTitle && (
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Add Task
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}