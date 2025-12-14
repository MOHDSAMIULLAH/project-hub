import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login');
  }

  return <DashboardClient user={user} />;
}
