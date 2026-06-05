import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientDashboard from './page.client';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get('qqai_access_token')?.value ||
    cookieStore.get('qqai_refresh_token')?.value ||
    cookieStore.get('token')?.value ||
    cookieStore.get('access')?.value;

  if (!token) {
    redirect('/signin');
  }

  return <ClientDashboard />;
}
