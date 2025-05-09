'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { loginClientUser } from '@/client/services/loginService'

// Login form schema
const formSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(1, { message: "Password is required" }),
})

export default function AdminLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)

    useEffect(() => {
        if (searchParams.get('reason') === 'auth') {
            setShowLoginModal(true)
        }
    }, [searchParams])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setAuthError(null)
        try {
            const response = await loginClientUser(values)

            if (response.auth_token) {
                localStorage.setItem('auth_token', response.auth_token)
                router.push('/admin/test') //Change to the desired route after login
            } else {
                setAuthError('Authentication failed')
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Login failed') {
                    setAuthError('Invalid email or password')
                } else if (error.message.includes('500')) {
                    setAuthError('Server error. Please try again later.')
                } else {
                    setAuthError('Authentication failed. Please try again.')
                }
            } else {
                setAuthError('An unexpected error occurred')
            }
            console.error('Login error:', error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Please log in to continue</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Card className="w-full max-w-md rounded-[34px] shadow-lg">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 mb-4">
                            {/* Replace with your actual logo */}
                            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                                <span className="text-black text-xl font-bold">LOGO</span>
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
                    </div>
                    <div>
                        <CardDescription>
                            Enter your credentials to access the admin dashboard
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
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

                            <div className="flex justify-center w-full text-white">
                                <div className="flex justify-center w-full">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 text-white border-0"
                                    >
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}