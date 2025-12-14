import LoginForm from '@/app/components/auth/LoginForm';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getAuthUser();
  
  if (user) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}
