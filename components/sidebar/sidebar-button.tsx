import { cn } from '@/lib/utils';
import React from 'react'

interface SidebarButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    className?: string;
}
const SidebarButton = ({ icon, label, isActive, className }: SidebarButtonProps) => {
    return (
        <div className={cn(`w-full cursor-pointer h-10 pl-12 flex items-center text-white 
        ${isActive ? ' text-sidebar-accent-foreground font-extrabold' : 'text-sidebar-primary hover:font-semibold '}
        `, className)}>
            <div className="flex items-center text-white gap-2">
                {icon}
                <span className="text-white">{label}</span>
            </div>
        </div>
    )
}

export default SidebarButton