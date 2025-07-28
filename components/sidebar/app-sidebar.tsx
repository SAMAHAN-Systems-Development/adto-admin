"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
    SidebarGroup,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { mainRoutes } from "@/lib/types/navigation";
import { usePathname } from "next/navigation";
import SidebarButton from "./sidebar-button";
import { Button } from "../ui/button";
import { useAuthStore } from "@/client/store/authStore";

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
        <Sidebar collapsible="offcanvas" className="rounded-br-sm" {...props}>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="mt-20">
                    <SidebarMenu>
                        {filteredRoutes.map((route) => (
                            <Link href={route.path} key={route.path}>
                                <SidebarButton
                                    icon={<route.icon />}
                                    label={route.name}
                                    isActive={pathname === route.path}
                                />
                            </Link>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="items-center mb-8 text-white">
                <Button
                    onClick={handleLogout}
                    className=""
                    variant={"destructive"}
                    size={"lg"}
                >
                    <LogOut />
                    <span className="text-sm">Logout</span>
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}