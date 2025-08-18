import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@radix-ui/react-collapsible';
import { BookOpen, ChevronDown, FileText, Search, User } from 'lucide-react';
import Link from 'next/link';

// Sidebar items
const data = {
  navigation: [
    {
      title: 'Book Browsing',
      icon: Search,
      url: '/',
    },
    {
      title: 'Personal Details',
      icon: User,
      url: '/me',
      items: [
        {
          title: 'My Loans',
          url: '/loans',
        },
        {
          title: 'Reading Analytics',
          url: '/analytics',
        },
      ],
    },
    {
      title: 'My Inventory',
      icon: BookOpen,
      url: '/inventory',
    },
    {
      title: 'My Report',
      icon: FileText,
      url: '/reports',
    },
  ],
};

export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.navigation.map(item => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map(subItem => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
