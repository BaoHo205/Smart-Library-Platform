import AppSidebar from '@/components/layout/sidebar/AppSidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getUserRole } from '@/lib/cookies/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getUserRole(); // Assuming this function fetches the user role

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <SidebarInset>
        <main>
          <SidebarTrigger className="m-2" />
          <div className="max-w-screen">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
