import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import NavFooter from './NavFooter';
import NavHeader from './NavHeader';
import NavMain from './NavMain';

interface AppSidebarProps {
  userRole: string | null;
}

export default async function AppSidebar({ userRole }: AppSidebarProps) {
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="transition-all duration-300 ease-in-out"
    >
      {/* Sidebar header with logo and title */}
      <SidebarHeader className="transition-all duration-300 ease-in-out">
        <NavHeader />
      </SidebarHeader>

      {/* Sidebar content with navigation items */}
      <SidebarContent className="transition-all duration-300 ease-in-out">
        <NavMain userRole={userRole} />
      </SidebarContent>

      {/* Sidebar footer with logout button */}
      <SidebarFooter className="transition-all duration-300 ease-in-out">
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
