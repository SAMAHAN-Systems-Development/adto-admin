'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/client/store/authStore'
import { UserType } from '@/client/types/user-type'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: UserType | UserType[]
    fallbackRoute?: string
}

export function ProtectedRoute({
    children,
    requiredRole,
    fallbackRoute = '/login?reason=auth'
}: ProtectedRouteProps) {
    const router = useRouter()
    const {
        isAuthenticated,
        isLoading,
        isCheckingSession,
        user
    } = useAuthStore()

    const hasRequiredRole = (userRole: UserType, required: UserType | UserType[]): boolean => {
        if (Array.isArray(required)) {
            return required.includes(userRole)
        }
        return userRole === required
    }

    useEffect(() => {
        if (!isLoading && !isCheckingSession) {
            if (!isAuthenticated) {
                router.push(fallbackRoute)
                return
            }

            if (requiredRole && user?.role && !hasRequiredRole(user.role, requiredRole)) {
                router.push('/unauthorized')
                return
            }
        }
    }, [isAuthenticated, isLoading, isCheckingSession, user, requiredRole, router, fallbackRoute])

    if (isLoading || isCheckingSession) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    if (requiredRole && user?.role && !hasRequiredRole(user.role, requiredRole)) {
        return null
    }

    return <>{children}</>
} 