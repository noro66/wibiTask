import React, { useEffect, useState } from 'react'
import { ChevronDown }                from 'lucide-react'
import { useAuthStore }  from '../store/authStore.js'
import { hasPermission } from '../constants/roles.js'

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const {getUsers, users, user} =  useAuthStore();

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.note || '',
    assignedTo: task?.assignedTo || ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isEditing = !!task;

  // Reset form when modal opens/closes or task changes
  useEffect(() => {

    const handleOpen = async ()=>{
      if (isOpen) {
        getUsers();
        setFormData({
          title: task?.title || '',
          description: task?.description || '',
          assignedTo: task?.assignedTo || ''
        });
        setIsDropdownOpen(false);
      }
    }
    handleOpen();
  }, [isOpen, task, getUsers]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSave({
        ...task,
        ...formData,
        description: formData.description || 'Add relevant details, blockers, or context for this task here.'
      });
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        {/* Title and Assignee in one line */}
        <div className="flex gap-4 mb-6">
          {/* Task Title */}
          <div className="flex-1">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Task title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What's in your mind?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
       focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
            />
          </div>

          {hasPermission(user, 'assign:task') && (
            <div className="flex-1">
            <label className="block text-lg font-bold text-gray-900 mb-3" id="assignedTo-label">
            Assign to
            </label>
            <div className="relative">
            <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-gray-50"
          aria-expanded={isDropdownOpen}
          aria-labelledby="assignedTo-label"
        >
        <span className={formData.assignedTo ? 'text-gray-900' : 'text-gray-400'}>
          {formData.assignedTo || 'Assign to'}
        </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
            {users?.length > 0 ? users.map((user) => (
              <button
                key={user}
                type="button"
                onClick={() => {
                  handleInputChange('assignedTo', user.username);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 transition-colors"
              >
                {user.username}
              </button>
            )) : (
              <div className="px-4 py-3 text-gray-500">No users available</div>
            )}
          </div>
        )}
      </div>
    </div>)}
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleCancel}
            type="button"
            className="px-6 py-2 text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={!formData.title.trim()}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            {isEditing ? 'Update task' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
