"use client"

import * as React from "react"
import { Search, User, BookOpen, FileText, LogOut, ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// Sidebar items
const data = {
  navigation: [
    {
      title: "Book Browsing",
      icon: Search,
      url: "/",
    },
    {
      title: "Personal Details",
      icon: User,
      url: "/me",
      items: [
        {
          title: "My Loans",
          url: "/loans",
        },
        {
          title: "Reading Analytics",
          url: "/analytics",
        },
      ],
    },
    {
      title: "My Inventory",
      icon: BookOpen,
      url: "/inventory",
    },
    {
      title: "My Report",
      icon: FileText,
      url: "/reports",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <Card className="flex items-center justify-center bg-muted p-2 rounded-md group-data-[collapsible=icon]:p-1">
          <Link href={"/"}>
            <div className="flex group-data-[collapsible=icon]:hidden">
              <div>
                <Image
                  src="/images/RMIT_logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="max-w-48"
                />
              </div>
              <div className="flex flex-col justify-center max-w-48">
                <p className="text-sm font-semibold leading-none">
                  Online Library
                </p>
                <p className="text-sm text-muted-foreground leading-none">
                  Team FTech
                </p>
              </div>
            </div>
            <Image
              src="/images/RMIT_logo_collapsed.png"
              alt="Logo"
              width={50}
              height={50}
              className="hidden group-data-[collapsible=icon]:inline"
            />
          </Link>
        </Card>
      </SidebarHeader>
      
      {/* Sidebar content with navigation items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navigation.map((item) => (
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
                          {item.items.map((subItem) => (
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
      </SidebarContent>
      
      {/* Sidebar footer with logout button */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="w-full"
            >
              <Button>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}