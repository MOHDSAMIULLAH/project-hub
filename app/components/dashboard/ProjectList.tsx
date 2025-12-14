'use client';

import { useRouter } from 'next/navigation';
import { Edit, Trash2, ArrowRight, Plus } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  onRefresh: () => void;
}

export default function ProjectList({ projects, onRefresh }: ProjectListProps) {
  const router = useRouter();

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Yet</h3>
          <p className="text-gray-600">Create your first project to get started with project management!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{project.title}</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => handleDelete(project.id)}
                className="p-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
          </div>

          <button
            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span>View Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
