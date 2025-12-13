'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectModal from './ProjectModal';

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = () => {
    fetchProjects();
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSuccess={handleProjectCreated}
        />
      )}
    </div>
  );
}
