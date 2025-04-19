'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { patientApi, Appointment } from '@/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';

const PatientDashboard = () => {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await patientApi.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userRole === 'patient') {
      fetchAppointments();
    }
  }, [isAuthenticated, userRole]);

  const handleAppointmentSuccess = () => {
    setIsDialogOpen(false);
    fetchAppointments();
  };

  // Redirect if not authenticated or not a patient
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (userRole !== 'patient') {
    router.push('/');
    return null;
  }

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Scheduled'
  );

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status !== 'Scheduled'
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Patient Dashboard</h1>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={fetchAppointments} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Link href="/appointments">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </Link>

            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
              <TabsTrigger value="past">Past Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="patient"
                      onDelete={fetchAppointments}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-6">You don't have any scheduled appointments.</p>
                  <Link href="/appointments">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Now ?
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pastAppointments.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole="patient"
                    />
                  ))}
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

export default function PatientDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PatientDashboard />
    </div>
  );
};