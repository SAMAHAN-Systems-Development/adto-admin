"use client";

import * as React from "react";
import {
  ArrowBigUpIcon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { mainRoutes } from "@/lib/types/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const filteredRoutes = React.useMemo(() => {
    if (!user) return [];

    return mainRoutes.filter(route => {
      if (!route.allowedRoles || route.allowedRoles.length === 0) {
        return true;
      }
      return route.allowedRoles.includes(user.role);
    });
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="[&>div]:!bg-gradient-to-b [&>div]:!from-blue-600 [&>div]:!to-blue-900"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-white/10 text-white hover:bg-white/10"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white">
            <ArrowBigUpIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-white">
            <span className="truncate font-semibold">Sysdev ADTO</span>
            <span className="truncate text-xs opacity-80">Design & Build</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredRoutes.map((route) => (
            <SidebarMenuItem key={route.path}>
              <SidebarMenuButton
                asChild
                isActive={pathname === route.path}
                className="text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white"
              >
                <Link href={route.path}>
                  <route.icon className="text-white" />
                  <span className="text-white">{route.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start p-0 h-auto text-white hover:bg-white/10 hover:text-white"
              >
                <LogOut className="text-white" />
                <span className="text-white">Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
