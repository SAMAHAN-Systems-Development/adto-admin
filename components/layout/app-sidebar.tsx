"use client";

import * as React from "react";
import { LogOut, PanelLeft } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { mainRoutes } from "@/lib/types/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { state, toggleSidebar } = useSidebar();

  const filteredRoutes = React.useMemo(() => {
    if (!user) return [];

    return mainRoutes.filter((route) => {
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
      console.error("Logout error:", error);
    }
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="sidebar-gradient" {...props}>
      <SidebarHeader>
        <div
          className={cn(
            "mt-6 mb-8 flex items-center",
            isCollapsed ? "mx-2 flex-col gap-4" : "mx-5 justify-between"
          )}
        >
          <div className={cn("flex items-center gap-4 min-w-0", isCollapsed && "flex-col")}>
            {/* Profile Circle */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-gray-900 text-white">
                  <div className="text-sm">
                    <div className="font-bold">
                      {user?.role === "ADMIN"
                        ? "Admin"
                        : user?.role === "ORGANIZATION"
                          ? "Organization"
                          : user?.role || "User"}
                    </div>
                    <div className="text-xs opacity-80">{user?.email || "User"}</div>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>

            {/* User Information - Hidden when collapsed */}
            {!isCollapsed && (
              <div className="flex flex-col text-white min-w-0">
                <span className="font-bold text-lg truncate">
                  {user?.role === "ADMIN"
                    ? "Admin"
                    : user?.role === "ORGANIZATION"
                      ? "Organization"
                      : user?.role || "User"}
                </span>
                <span className="text-xs opacity-80 truncate">{user?.email || "User"}</span>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className={cn(
                  "text-white hover:bg-white/10 rounded-md p-1.5 transition-colors flex-shrink-0",
                  isCollapsed && "w-8 h-8 flex items-center justify-center"
                )}
                aria-label="Toggle Sidebar"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-gray-900 text-white">
                Expand Sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className={isCollapsed ? "mx-2" : "mx-5"}>
          <SidebarMenu className="gap-3 my-10">
            {filteredRoutes.map((route) => (
              <SidebarMenuItem key={route.path}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.path}
                      className="text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white p-5"
                    >
                      <Link href={route.path} className="flex items-center gap-3">
                        <route.icon className="text-white w-6 h-6 flex-shrink-0" />
                        {!isCollapsed && <span className="text-white text-base">{route.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-gray-900 text-white">
                      {route.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <div className="mt-5 mb-8">
            <div className="h-px bg-white/30"></div>
          </div>

          {/* Account and Settings buttons */}
          <SidebarMenu className="gap-3 mb-5">
            <SidebarMenuItem>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild className="text-white hover:bg-white/10 p-5">
                    <Link href="/account" className="flex items-center gap-3">
                      <HiUser className="text-white w-6 h-6 flex-shrink-0" />
                      {!isCollapsed && <span className="text-white text-base">Account</span>}
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-gray-900 text-white">
                    Account
                  </TooltipContent>
                )}
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild className="text-white hover:bg-white/10 p-5">
                    <Link href="/settings" className="flex items-center gap-3">
                      <IoMdSettings className="text-white w-6 h-6 flex-shrink-0" />
                      {!isCollapsed && <span className="text-white text-base">Settings</span>}
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-gray-900 text-white">
                    Settings
                  </TooltipContent>
                )}
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="mt-10">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  className={cn(
                    "w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-3 p-5",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <LogOut className="w-6 h-6 flex-shrink-0" />
                  {!isCollapsed && <span className="text-base">Logout</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-gray-900 text-white">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
