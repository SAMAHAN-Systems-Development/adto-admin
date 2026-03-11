"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  isLoading,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("shadow-sm overflow-hidden", className)}>
      <CardContent className="p-5 flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground truncate">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-900">
          {isLoading ? "—" : value}
        </p>
      </CardContent>
    </Card>
  );
}
