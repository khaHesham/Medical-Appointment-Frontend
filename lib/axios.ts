import axios,{ AxiosError } from "axios";


const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    switch (status) {
      case 400:
        return serverMessage || 'Invalid data. Please check your input.';
      case 401:
        return serverMessage || 'Unauthorized. Please check your credentials.';
      case 403:
        return serverMessage || 'Forbidden. You are not allowed to perform this action.';
      case 409:
        return serverMessage || 'User already exists.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return serverMessage || 'An unexpected error occurred.';
    }
  }

  return 'An unknown error occurred.';
};


const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5172"
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
  registerPatient: async (userData: RegisterRequest) => {
    const response = await apiClient.post('/auth/register/patient', userData);
    return response.data;
  },
  registerDoctor: async (userData: RegisterRequest) => {
    console.log(userData);
    const response = await apiClient.post('/auth/register/doctor', userData);
    return response.data;
  },
};

// Patient API
export const patientApi = {
  getProfile: async () => {
    const response = await apiClient.get('/patients/me');
    return response.data;
  },
  updateProfile: async (profileData: UpdatePatientRequest) => {
    const response = await apiClient.patch('/patients/me', profileData);
    return response.data;
  },
  getAppointments: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`/patients/appointments/all?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
  scheduleAppointment: async (appointmentData: ScheduleAppointmentRequest) => {
    const response = await apiClient.post('/patients/appointments/schedule', appointmentData);
    return response.data;
  },
  getDoctors: async () => {
    const response = await apiClient.get('/doctors/all');
    return response.data;
  },
};

// Doctor API
export const doctorApi = {
  getProfile: async () => {
    const response = await apiClient.get('/doctors/me');
    return response.data;
  },
  updateProfile: async (profileData: UpdateDoctorRequest) => {
    const response = await apiClient.patch('/doctors/me', profileData);
    return response.data;
  },
  getAppointments: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`/doctors/appointments/all?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
};

// Appointment API
export const appointmentApi = {
  deleteAppointment: async (id: number) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },
};

// Types based on API schema
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ScheduleAppointmentRequest {
  doctorId: number;
  appointmentDate: string;
  reason: string;
}

export interface UpdateDoctorRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  specialization?: string;
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  appointmentDate: string;
  reason: string;
  status: string;
}

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export default apiClient;