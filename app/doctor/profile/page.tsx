'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import  Footer  from '@/components/layout/Footer';
import  ProfileForm  from '@/components/profile/ProfileForm';
import { useAuth } from '@/lib/auth-context';

const DoctorProfile = () => {
    const router = useRouter();
    const { isAuthenticated, userRole } = useAuth();

    // Redirect if not authenticated or not a doctor
    if (typeof window !== 'undefined') {
        if (!isAuthenticated) {
            router.push('/login');
            return null;
        }

        if (userRole !== 'doctor') {
            router.push('/');
            return null;
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 w-full py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8">Doctor Profile</h1>

                    <div className="max-w-2xl mx-auto">
                        <ProfileForm userRole="doctor" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DoctorProfile;