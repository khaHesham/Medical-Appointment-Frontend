'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { doctorApi, Appointment } from '@/lib/axios';
import { toast } from 'sonner';

export function DoctorDashboard() {
    const { isAuthenticated, userRole } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = async (page = 1, size = 10) => {
        setIsLoading(true);
        try {
            const data = await doctorApi.getAppointments( page, size );
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Wait until authentication and role are resolved
        setIsLoading(true);
        fetchAppointments();
    }, [isAuthenticated, userRole, router]);

    const upcomingAppointments = appointments.filter(
        (appointment) => appointment.status === 'Scheduled'
    );

    const pastAppointments = appointments.filter(
        (appointment) => appointment.status !== 'Scheduled'
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreAppointments = async () => {
        if (isLoading || !hasMore) return;

        try {
            setIsLoading(true);
            const data = await doctorApi.getAppointments(currentPage + 1, 10);
            if (data.length > 0) {
                setAppointments((prev) => [...prev, ...data]);
                setCurrentPage((prev) => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more appointments:', error);
            toast.error('Failed to load more appointments');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 w-full py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <h1 className="text-3xl font-bold mb-4 md:mb-0">Doctor Dashboard</h1>

                        <Button variant="outline" onClick={() => fetchAppointments()} disabled={isLoading}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                            <TabsTrigger value="past">Past Appointments</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming">
                            {isLoading && currentPage === 1 ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : upcomingAppointments.length > 0 ? (
                                <div>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {upcomingAppointments.map((appointment) => (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                userRole="doctor"
                                                onDelete={fetchAppointments}
                                            />
                                        ))}
                                    </div>
                                    {hasMore && (
                                        <div className="flex justify-center mt-6">
                                            <Button onClick={loadMoreAppointments} disabled={isLoading}>
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    'Load More'
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <h3 className="text-xl font-medium text-gray-600">No Upcoming Appointments</h3>
                                    <p className="text-gray-500">You don't have any scheduled appointments with patients.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past">
                            {isLoading && currentPage === 1 ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : pastAppointments.length > 0 ? (
                                <div>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {pastAppointments.map((appointment) => (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                userRole="doctor"
                                            />
                                        ))}
                                    </div>
                                    {hasMore && (
                                        <div className="flex justify-center mt-6">
                                            <Button onClick={loadMoreAppointments} disabled={isLoading}>
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    'Load More'
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <h3 className="text-xl font-medium text-gray-600">No Past Appointments</h3>
                                    <p className="text-gray-500">Your appointment history will appear here.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <DoctorDashboard />
        </div>
    );
}
