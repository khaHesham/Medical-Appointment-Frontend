import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-primary">MediAppoint</h2>
            <p className="text-gray-600 text-sm mt-1">Simplifying healthcare appointments</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Ramyro. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1 flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}