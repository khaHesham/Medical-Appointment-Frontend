'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { patientApi, doctorApi, Patient, Doctor, UpdatePatientRequest, UpdateDoctorRequest } from '@/lib/axios';
import { toast } from 'sonner';

interface ProfileFormProps {
    userRole: 'patient' | 'doctor';
}

export default function ProfileForm({ userRole }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<Patient | Doctor | null>(null);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                if (userRole === 'patient') {
                    const data = await patientApi.getProfile();
                    setProfile(data);
                    if (data.dateOfBirth) {
                        setDateOfBirth(new Date(data.dateOfBirth));
                    }
                } else {
                    const data = await doctorApi.getProfile();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userRole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile) return;

        setIsSaving(true);
        try {
            if (userRole === 'patient') {
                const updateData: UpdatePatientRequest = {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    phoneNumber: profile.phoneNumber,
                    dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : undefined,
                };
                await patientApi.updateProfile(updateData);
            } else {
                const doctorProfile = profile as Doctor;
                const updateData: UpdateDoctorRequest = {
                    firstName: doctorProfile.firstName,
                    lastName: doctorProfile.lastName,
                    phoneNumber: doctorProfile.phoneNumber,
                    specialization: doctorProfile.specialization,
                };
                await doctorApi.updateProfile(updateData);
            }

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="pt-6 flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Failed to load profile data</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="bg-gray-50">
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={profile.email} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground text-red-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                    </div>

                    {userRole === 'patient' && (
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="dateOfBirth"
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !dateOfBirth && 'text-muted-foreground'
                                        )}
                                        disabled={isSaving}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateOfBirth ? format(dateOfBirth, 'PPP') : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateOfBirth}
                                        onSelect={setDateOfBirth}
                                        initialFocus
                                        disabled={(date) => date > new Date()}
                                        className="bg-black text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    {userRole === 'doctor' && (
                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                                id="specialization"
                                name="specialization"
                                value={(profile as Doctor).specialization || ""}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                    )}
                </CardContent>

                <CardFooter className="bg-gray-50">
                    <Button type="submit" className="w-full" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
