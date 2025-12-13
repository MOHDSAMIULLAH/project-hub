import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProjectList from '@/app/components/dashboard/ProjectList';
import LogoutButton from '@/app/components/auth/LogoutButton';

export default async function DashboardPage() {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Hub</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Projects
          </h2>
          <p className="text-gray-600">
            Manage your projects and tasks efficiently
          </p>
        </div>

        <ProjectList />
      </main>
    </div>
  );
}
