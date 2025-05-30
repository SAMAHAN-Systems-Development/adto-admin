'use client'

import { UserMenu } from '@/components/auth/UserMenu'
import { useAuthStore } from '@/client/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
    const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Dashboard
                        </h1>
                        <UserMenu />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome!</CardTitle>
                                <CardDescription>
                                    You are in the protected (main) route group.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Email:</strong> {user?.email}</p>
                                    <p><strong>Role:</strong> {user?.role}</p>
                                    <p><strong>User ID:</strong> {user?.id}</p>
                                    {user?.orgId && (
                                        <p><strong>Organization:</strong> {user?.orgId}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Route Group Protection</CardTitle>
                                <CardDescription>
                                    This page is protected by the (main) layout.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm">Protected by (main) layout</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm">Any authenticated user</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-sm">No additional role restrictions</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Architecture</CardTitle>
                                <CardDescription>
                                    Clean route group-based protection.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        • <strong>app/layout.tsx</strong> - No protection (public routes)
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        • <strong>app/(main)/layout.tsx</strong> - ProtectedRoute wrapper
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        • <strong>This page</strong> - No additional protection needed
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}