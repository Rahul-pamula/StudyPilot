"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router   = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
