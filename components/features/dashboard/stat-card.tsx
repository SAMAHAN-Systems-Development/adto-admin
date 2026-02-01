"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
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
    <div
      className={cn(
        "rounded-[20px] p-[1px] bg-gradient-to-b from-blue-800 to-blue-500",
        className
      )}
    >
      <Card className="rounded-[20px] border-0 bg-[#E2E8F0]">
        <CardContent className="px-6 py-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-medium bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
              {title}
            </p>

            <div className="text-blue-800">
              <ExternalLink size={15} />
            </div>
          </div>

          <p className="text-5xl font-medium bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
            {isLoading ? "—" : value}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
