"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
        {/* Icon Container */}
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-red-100 flex items-center justify-center mb-10 transform hover:rotate-6 transition-transform duration-300">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-red-50 rounded-full text-red-600 text-sm font-medium mb-2 border border-red-100">
            Error 403
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Oops! Access Forbidden.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed px-4">
            It seems you&#39;ve tried to reach a restricted area. Your current
            role does not have permission to access some of the resources you
            are looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 px-8 text-base border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Take Me Home
          </Button>
        </div>

        {/* Help Link */}
        <p className="mt-12 text-sm text-gray-400">
          Need help? <a href="#" className="text-blue-500 hover:underline">Contact system administrator</a>
        </p>
      </div>
    </div>
  );
}
