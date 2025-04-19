"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

export function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar className="bg-primary text-white w-64 p-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center p-2 rounded hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </Sidebar>
    </SidebarProvider>
  );
}
