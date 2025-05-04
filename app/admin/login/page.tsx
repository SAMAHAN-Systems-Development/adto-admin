'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

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
    const [authError, setAuthError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // TODO: Implement actual authentication when backend is available
            console.log('Login attempt:', values);

            setAuthError(null);

            await new Promise(resolve => setTimeout(resolve, 500));

            // Placeholder for successful login
            router.push('/admin/dashboard');

        } catch (error) {
            setAuthError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
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