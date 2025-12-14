'use client';

import { Edit, Trash2, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    todo: Clock,
    'in-progress': AlertCircle,
    completed: CheckCircle,
  };

  const StatusIcon = statusIcons[task.status];

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">{task.title}</h4>
          {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
        </div>
        <div className="flex space-x-1 ml-2">
          <button onClick={onEdit} className="p-1 text-gray-600 hover:text-indigo-600">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1 text-gray-600 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]} cursor-pointer`}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {task.estimated_hours && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            {task.estimated_hours}h
          </span>
        )}
      </div>
    </div>
  );
}
