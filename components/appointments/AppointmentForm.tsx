'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { patientApi, Doctor, ScheduleAppointmentRequest } from '@/lib/axios';
import { toast } from 'sonner';

interface AppointmentFormProps {
  onSuccess: () => void;
}

export function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [doctorId, setDoctorId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchDoctors = async () => {
    try {
      const response = await patientApi.getDoctors();
      console.log('Doctors fetched:', response); // Check if data is returned
      setDoctors(response);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Please provide a reason for the appointment';
    } else if (reason.length > 500) {
      newErrors.reason = 'Reason must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const appointmentData: ScheduleAppointmentRequest = {
        doctorId: parseInt(doctorId),
        appointmentDate: date!.toISOString().split('T')[0], // Format as YYYY-MM-DD
        reason: reason,
      };

      await patientApi.scheduleAppointment(appointmentData);
      toast.success('Appointment scheduled successfully');

      // Reset form
      setDate(undefined);
      setDoctorId('');
      setReason('');

      // Notify parent component
      onSuccess();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Appointment</CardTitle>
        <CardDescription>Fill in the details to book an appointment with a doctor</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select
              value={doctorId}
              onValueChange={setDoctorId}
              onOpenChange={(open) => {
                if (open) fetchDoctors();
              }}
            >
              <SelectTrigger id="doctor" className={cn(errors.doctorId && 'border-destructive')}>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
                <SelectContent className="w-full bg-gray-100">
                {(doctors || []).map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </SelectItem>
                ))}
                </SelectContent>
            </Select>
            {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                    errors.date && 'border-destructive'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  className="bg-black text-white"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date: Date) =>
                    date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the appointment"
              className={cn(errors.reason && 'border-destructive')}
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
            <p className="text-xs text-muted-foreground">{reason.length}/500 characters</p>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Appointment'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

