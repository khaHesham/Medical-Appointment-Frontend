import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCog, CalendarClock, ClipboardList } from "lucide-react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-gray-800">
              Medical Appointments Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Schedule appointments with healthcare professionals quickly and easily.
              Manage your medical visits all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-black text-white shadow-lg shadow-gray-500/50 hover:bg-black/90 px-8 py-4 text-lg">
                <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" className="bg-black text-white border border-white shadow-lg shadow-gray-500/50 hover:bg-black/90 px-8 py-4 text-lg">
                <Link href="/login">Sign In</Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-400">How It Works</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Register</h3>
                <p className="text-gray-600">Create an account as a patient or doctor to get started.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCog className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Complete Profile</h3>
                <p className="text-gray-600">Fill in your medical information for better service.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarClock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Book Appointment</h3>
                <p className="text-gray-600">Choose a doctor and schedule a convenient time.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Manage Visits</h3>
                <p className="text-gray-600">View, reschedule, or cancel your appointments anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-400">
              Join thousands of patients and doctors who are already using our platform.
            </p>
            <Button className="bg-black text-white shadow-lg shadow-gray-500/50 hover:bg-black/90" asChild size="lg" variant="secondary">
              <Link href="/register">Create an Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}