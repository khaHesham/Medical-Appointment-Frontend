'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut } from 'lucide-react';

export function Header() {
  const { isAuthenticated, userRole, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-primary font-poppins text-gray-800">Ramyro</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-primary">Home</Link>
          
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="text-gray-600 hover:text-primary">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-primary">Register</Link>
            </>
          ) : userRole === 'patient' ? (
            <>
              <Link href="/patient/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
              <Link href="/patient/profile" className="text-gray-600 hover:text-primary">Profile</Link>
            </>
          ) : (
            <>
              <Link href="/doctor/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
              <Link href="/doctor/profile" className="text-gray-600 hover:text-primary">Profile</Link>
            </>
          )}
          
          {isAuthenticated && (
            <Button variant="outline" onClick={logout} className="flex items-center bg-black text-white hover:bg-black/90">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              
              {!isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              ) : userRole === 'patient' ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/patient/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/patient/profile">Profile</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/doctor/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/doctor/profile">Profile</Link>
                  </DropdownMenuItem>
                </>
              )}
              
              {isAuthenticated && (
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}