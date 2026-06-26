"use client";

import { AdminProvider } from "@/lib/admin-context";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { useState } from "react";
import { usePathname } from "next/navigation";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  let title = "Dashboard";
  if (pathname.includes("/produk")) title = "Manajemen Produk";
  if (pathname.includes("/kategori")) title = "Manajemen Kategori";

  return (
    <div className="flex h-screen bg-[#2A0206] overflow-hidden text-[#FDFBF7] font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
