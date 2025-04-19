'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
    const { registerPatient, registerDoctor } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(formData.password)) {
            newErrors.password = 'Password must include uppercase, lowercase, and number';
        }

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (userType === 'patient') {
                await registerPatient(formData);
            } else {
                await registerDoctor(formData);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrors({ general: error.message });
            } else {
                // Handle server-specific error response, assuming the error has a 'message' property
                const errorMessage = typeof error === 'string' ? error : 'Failed to register. Please try again.';
                setErrors({ general: errorMessage });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-gray-100">
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>Enter your details to create your account</CardDescription>
            </CardHeader>

            <Tabs defaultValue="patient" onValueChange={(value) => setUserType(value as 'patient' | 'doctor')}>
                <TabsList className="grid w-full grid-cols-2 border border-black">
                    <TabsTrigger
                        value="patient"
                        className={`${userType === 'patient' ? 'bg-black text-white' : 'bg-transparent text-black'
                            } py-2 px-4 rounded`}
                    >
                        Patient
                    </TabsTrigger>
                    <TabsTrigger
                        value="doctor"
                        className={`${userType === 'doctor' ? 'bg-black text-white' : 'bg-transparent text-black'
                            } py-2 px-4 rounded`}
                    >
                        Doctor
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="patient">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="bg-gray-200"
                                    />
                                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="bg-gray-200"
                                    />
                                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-gray-200"
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-gray-200"
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-gray-200"
                                />
                                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full bg-black text-white shadow-lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Register as Patient"
                                )}
                            </Button>
                            {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </TabsContent>

                <TabsContent value="doctor">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="bg-gray-200"
                                    />
                                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="bg-gray-200"
                                    />
                                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-gray-200"
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-gray-200"
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="bg-gray-200"
                                />
                                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full bg-black text-white shadow-lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Register as Doctor"
                                )}
                            </Button>
                            {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </TabsContent>
            </Tabs>
        </Card>
    );
}


export function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <RegisterForm />
        </div>
    );
}