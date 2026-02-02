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
      className={cn("rounded-[20px] border border-transparent", className)}
      style={{
        background:
          "linear-gradient(#E2E8F0, #E2E8F0) padding-box, linear-gradient(to bottom, #1e40af, #3b82f6) border-box",
      }}
    >
      <Card className="rounded-[20px] border-0 bg-transparent shadow-none">
        <CardContent className="px-6 py-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-2xl font-medium bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent truncate">
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
