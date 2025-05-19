import { Check, Edit, Trash2 } from 'lucide-react'
import React                   from 'react'

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

export default  Task;