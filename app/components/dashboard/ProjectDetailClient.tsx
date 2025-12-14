'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Sparkles, BarChart3, LogOut, User } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import AIModal from './AIModal';
import type { Project, Task, AITaskSuggestion, ProjectAnalysis } from '@/types';
import type { JWTPayload } from '@/lib/auth';

interface Props {
  user: JWTPayload;
  project: Project;
  initialTasks: Task[];
}

export default function ProjectDetailClient({ user, project, initialTasks }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AITaskSuggestion[]>([]);
  const [projectAnalysis, setProjectAnalysis] = useState<ProjectAnalysis | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?project_id=${project.id}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, project_id: project.id }),
      });

      if (res.ok) {
        await fetchTasks();
        setShowTaskModal(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        await fetchTasks();
        setShowTaskModal(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleGenerateAITasks = async () => {
    setAiLoading(true);
    setShowAIModal(true);

    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id }),
      });

      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnalyzeProject = async () => {
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id }),
      });

      const data = await res.json();
      setProjectAnalysis(data.analysis);
    } catch (error) {
      console.error('Failed to analyze project:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAISuggestion = async (suggestion: AITaskSuggestion) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          description: suggestion.description || 'AI-suggested task based on project analysis',
          status: 'todo',
          priority: suggestion.priority,
          estimated_hours: suggestion.estimatedHours,
          project_id: project.id,
        }),
      });

      if (res.ok) {
        await fetchTasks();
        setAiSuggestions(aiSuggestions.filter((s) => s.title !== suggestion.title));
      }
    } catch (error) {
      console.error('Failed to add AI suggestion:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Project Hub</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>

              <button
                onClick={handleGenerateAITasks}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Suggestions</span>
              </button>

              <button
                onClick={handleAnalyzeProject}
                disabled={aiLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{aiLoading ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>
          </div>

          {/* AI Analysis */}
          {projectAnalysis && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">AI Project Analysis</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-green-600">{projectAnalysis.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${projectAnalysis.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Insights</h4>
                  <ul className="space-y-1">
                    {projectAnalysis.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {projectAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks ({tasks.length})</h3>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No tasks yet</p>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => {
                      setEditingTask(task);
                      setShowTaskModal(true);
                    }}
                    onDelete={() => handleDeleteTask(task.id)}
                    onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
        />
      )}

      {showAIModal && (
        <AIModal
          loading={aiLoading}
          suggestions={aiSuggestions}
          onClose={() => {
            setShowAIModal(false);
            setAiSuggestions([]);
          }}
          onAddSuggestion={handleAddAISuggestion}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Developed by: Mohd Samiullah</p>
              <p className="mt-1">
                GitHub:{' '}
                <a
                  href="https://github.com/MOHDSAMIULLAH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  @MOHDSAMIULLAH
                </a>
              </p>
              <p>
                LinkedIn:{' '}
                <a
                  href="https://www.linkedin.com/in/mohd-samiullah1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  /in/mohd-samiullah1
                </a>
              </p>
            </div>
            <div className="text-sm text-gray-500">© 2025 House of Edtech Assignment</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
