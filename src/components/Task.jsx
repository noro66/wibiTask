import { Check, Edit, Trash2 } from 'lucide-react'
import React                   from 'react'
import { useAuthStore }        from '../store/authStore.js'
import { hasPermission }       from '../../public/constants/auth.js'

const Task = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const {user} = useAuthStore();

  const textClass = task?.status === 'done'
    ? "line-through text-gray-400"
    : "text-gray-900";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {user && user.role === "admin" && (<div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500 text-sm font-medium">@{task?.assignedTo}</span>
          </div>)}
          <h3 className={ textClass + 'text-lg font-semibold text-gray-900 mb-1 ' }>{task?.title}</h3>
          <p className={textClass + 'text-gray-500 text-sm' }>{task.description}</p>
        </div>
        <div className="items-center gap-2 ml-4 hidden group-hover:flex">
          {task?.status !== 'done' && hasPermission(user, 'update:task') && (<button
            onClick={() => onEdit(task.id)}
            className="p-2 cursor-pointer  text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit task"
          >
            <Edit className="w-5 h-5" />
          </button>)}
          {hasPermission(user, 'delete:task') && (<button
            onClick={() => onDelete(task.id)}
            className="p-2 cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>)}
          {task?.status !== 'done' && hasPermission(user, 'update:task') && (<button
            onClick={() => onToggleComplete(task.id)}
            className="px-4 py-2 rounded-lg font-medium  cursor-pointer transition-colors bg-blue-500 hover:bg-blue-600 text-white"
          >
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 border  rounded-full " />
                Done
              </span>
          </button>)}
        </div>
      </div>
    </div>
  );
};

export default  Task;