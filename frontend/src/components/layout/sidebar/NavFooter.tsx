'use client';

import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import useUser from '@/hooks/useUser';
import { LogOut } from 'lucide-react';

export default function NavFooter() {
  const { logout } = useUser();
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="w-full">
          <Button onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
