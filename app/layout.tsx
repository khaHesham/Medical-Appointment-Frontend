import "../app/globals.css";
import { Inter } from "next/font/google";
import { cn } from "../lib/utils";
import { AuthProvider } from "@/lib/auth-context"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medical Appointment System",
  description: "Book appointments with doctors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-white font-sans", inter.className)}>
        <AuthProvider> {}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
