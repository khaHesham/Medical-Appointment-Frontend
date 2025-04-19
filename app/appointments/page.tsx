'use client';

import { useRouter } from 'next/navigation';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { Card } from '@/components/ui/card';

const NewAppointmentPage = () => {
  const router = useRouter();

  const handleAppointmentSuccess = () => {
    router.push('/patient/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-lg p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Schedule New Appointment</h2>
          <p className="text-muted-foreground text-sm">
            Fill in the details to book an appointment with a doctor.
          </p>
        </div>
        <AppointmentForm onSuccess={handleAppointmentSuccess} />
      </Card>
    </div>
  );
};

export default NewAppointmentPage;
