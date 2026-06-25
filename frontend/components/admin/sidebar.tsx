"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, LogOut } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produk", label: "Produk", icon: Package },
    { href: "/admin/kategori", label: "Kategori", icon: Tags },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#2A0206] border-r border-[#D4AF37]/20 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#D4AF37]/20">
          <span className="font-serif text-xl text-[#D4AF37]">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-[#3A040A] text-[#D4AF37] border border-[#D4AF37]/30" : "text-[#F5F2EB] hover:bg-[#3A040A]/50 hover:text-[#D4AF37]"}`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-[#3A040A] rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
