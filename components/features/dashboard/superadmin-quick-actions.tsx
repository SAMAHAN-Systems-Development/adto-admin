"use client";

import Link from "next/link";
import { Building2, PlusCircle, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SuperadminQuickActions() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/organizations" className="group">
          <Card className="transition-all duration-200 hover:shadow-md hover:border-blue-300">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">View Organizations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/organizations/create" className="group">
          <Card className="transition-all duration-200 hover:shadow-md hover:border-blue-300">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">Create Organization</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/organizations?createParent=true" className="group">
          <Card className="transition-all duration-200 hover:shadow-md hover:border-blue-300">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Network className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">Create Parent Org</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
