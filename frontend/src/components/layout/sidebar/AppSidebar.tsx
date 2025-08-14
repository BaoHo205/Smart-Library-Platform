'use client';

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="icon" className='transition-all duration-300 ease-in-out'>
      {/* Sidebar header with logo and title */}
      <SidebarHeader className='transition-all duration-300 ease-in-out'>
        <NavHeader />
      </SidebarHeader>

      {/* Sidebar content with navigation items */}
      <SidebarContent className='transition-all duration-300 ease-in-out'>
        <NavMain />
      </SidebarContent>

      {/* Sidebar footer with logout button */}
      <SidebarFooter className='transition-all duration-300 ease-in-out'>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
