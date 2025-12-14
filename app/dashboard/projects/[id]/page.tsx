import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { projects, tasks } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import ProjectDetailClient from '../../../components/dashboard/ProjectDetailClient';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  const { id } = await params;
  
  if (!user) {
    redirect('/login');
  }

  // Fetch project
  const projectResult = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.createdBy, user.userId)));

  if (projectResult.length === 0) {
    redirect('/dashboard');
  }

  const project = projectResult[0];

  // Fetch tasks
  const tasksResult = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, id))
    .orderBy(desc(tasks.createdAt));

  return (
    <ProjectDetailClient
      user={user}
      project={project as any}
      initialTasks={tasksResult as any}
    />
  );
}
