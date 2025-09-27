"use client";

import * as React from "react";
import {
  LogOut,
} from "lucide-react";
import { IoMdSettings } from "react-icons/io";
import { HiUser } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
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
      className="[&>div]:!bg-gradient-to-b [&>div]:!from-blue-600 [&>div]:!to-blue-900"
      {...props}
    >
      <SidebarHeader>
        <div className="mt-6 mb-12 mx-5 flex items-center gap-4">
          {/* Profile Circle Placeholder */}
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          {/* User Information */}
          <div className="flex  flex-col text-white">
            <span className="font-bold text-xl">
              {user?.role === 'ADMIN' ? 'Admin' :
                user?.role === 'ORGANIZATION' ? 'Organization' :
                  user?.role || 'User'}
            </span>
            <span className="text-xs opacity-80 truncate">
              {user?.email || 'User'}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="mx-5">
          <SidebarMenu className="gap-3 my-10">
            {filteredRoutes.map((route) => (
              <SidebarMenuItem key={route.path}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === route.path}
                  className="text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white p-5"
                >
                  <Link href={route.path} className="flex items-center gap-3">
                    <route.icon className="text-white w-6 h-6" />
                    <span className="text-white text-base">{route.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <div className="mt-5 mb-8">
            <div className="h-px bg-white"></div>
          </div>

          {/* Account and Settings buttons */}
          <SidebarMenu className="gap-3 mb-5">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="text-white hover:bg-white/10 p-5"
              >
                <Link href="/account" className="flex items-center gap-3">
                  <HiUser className="text-white w-6 h-6" />
                  <span className="text-white text-base">Account</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="text-white hover:bg-white/10 p-5"
              >
                <Link href="/settings" className="flex items-center gap-3">
                  <IoMdSettings className="text-white w-6 h-6" />
                  <span className="text-white text-base">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="mt-10">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-3 p-5"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-base">Logout</span>
            </Button>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
