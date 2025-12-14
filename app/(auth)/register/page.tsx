import RegisterForm from '@/app/components/auth/RegisterForm';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const user = await getAuthUser();
  
  if (user) {
    redirect('/dashboard');
  }

  return <RegisterForm />;
}
