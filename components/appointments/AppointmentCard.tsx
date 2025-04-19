import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { appointmentApi, Appointment } from '@/lib/axios';
import { toast } from 'sonner';

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: 'patient' | 'doctor';
  onDelete?: () => void;
}

export function AppointmentCard({ appointment, userRole, onDelete }: AppointmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await appointmentApi.deleteAppointment(appointment.id);
      toast.success('Appointment cancelled successfully');
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formattedDate = format(new Date(appointment.appointmentDate), 'MMMM d, yyyy');
  const formattedTime = format(new Date(appointment.appointmentDate), 'h:mm a');
  
  return (
    <Card className="w-full bg-gray-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {userRole === 'patient' ? `Dr. ${appointment.doctorName}` : appointment.patientName}
          </CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 
            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {appointment.status}
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          {formattedDate} at {formattedTime}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-start space-x-2 mb-2">
          <User className="h-4 w-4 mt-0.5 text-gray-500" />
          <div>
            <p className="text-sm font-medium">
              {userRole === 'patient' ? 'Doctor' : 'Patient'}
            </p>
            <p className="text-sm text-gray-600">
              {userRole === 'patient' ? appointment.doctorName : appointment.patientName}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <FileText className="h-4 w-4 mt-0.5 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Reason</p>
            <p className="text-sm text-gray-600">{appointment.reason}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {appointment.status === 'Scheduled' && (
            <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
              variant="outline" 
              className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
              >
              {isDeleting ? 'Cancelling...' : 'Cancel Appointment'}
              </Button>
            </AlertDialogTrigger>
            </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}