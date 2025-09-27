'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthStore } from '@/lib/store/authStore'
import { loginSchema } from '@/lib/zod/login.schema'
import type { AdminLoginRequest } from '@/lib/types/requests/AdminLoginRequest'

export default function AdminLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showLoginModal, setShowLoginModal] = useState(false)

    const {
        login,
        isLoggingIn,
        error: authError,
        isAuthenticated,
        clearError
    } = useAuthStore()

    useEffect(() => {
        if (searchParams.get('reason') === 'auth') {
            setShowLoginModal(true)
        }
    }, [searchParams])

    useEffect(() => {
        if (isAuthenticated) {
            const redirectUrl = searchParams.get('redirect') || '/dashboard'
            router.push(redirectUrl)
        }
    }, [isAuthenticated, router, searchParams])

    const form = useForm<AdminLoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: AdminLoginRequest) {
        clearError()
        try {
            await login(values)
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-br from-blue-600 to-blue-900">
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Please log in to continue</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Card className="w-full max-w-md mx-auto rounded-2xl md:rounded-[34px] shadow-lg">
                <CardHeader className="flex flex-col items-center space-y-3 md:space-y-2 p-6 md:pb-2">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4">
                            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                                <span className="text-black text-lg md:text-xl font-bold">LOGO</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">Admin Login</CardTitle>
                    </div>
                    <div className="text-center">
                        <CardDescription className="text-sm md:text-base">
                            Enter your credentials to access the admin dashboard
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-6 pt-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {authError && (
                                <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                                    {authError}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your.email@here.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-2">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg font-medium"
                                >
                                    {isLoggingIn ? 'Logging in...' : 'Login'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
