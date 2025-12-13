import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_hours: number;
  created_at: string;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login');
  }

  // Await params in Next.js 16
  const { id } = await params;

  // Fetch project details
  const projectResult = await query(
    'SELECT * FROM projects WHERE id = $1',
    [id]
  );

  if (projectResult.rows.length === 0) {
    redirect('/dashboard');
  }

  const project: Project = projectResult.rows[0];

  // Fetch tasks for this project
  const tasksResult = await query(
    'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
    [id]
  );

  const tasks: Task[] = tasksResult.rows;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Dashboard
            </Link>
          </div>
          <span className="text-gray-700">Welcome, {user.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {project.title}
          </h1>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="text-sm text-gray-500">
            Created on {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + New Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No tasks yet</p>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                Create your first task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                        {task.estimated_hours && (
                          <span className="text-gray-500">
                            {task.estimated_hours}h estimated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
