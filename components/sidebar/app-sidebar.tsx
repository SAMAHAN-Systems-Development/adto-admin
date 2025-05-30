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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="offcanvas" className="rounded-br-sm" {...props}>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="mt-20">
                    <SidebarMenu>
                        {mainRoutes.map((route) => (
                            <Link href={route.path} key={route.path} >
                                <SidebarButton
                                    icon={<route.icon />}
                                    label={route.name}
                                    isActive={pathname === route.path} />
                            </Link>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="items-center mb-8">
                <Button className="" variant={"destructive"} size={"lg"}>
                    <LogOut />
                    <span className="text-sm">Logout</span>
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    );
}