"use client";

import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAdmin();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A0206] px-4">
      <div className="w-full max-w-md bg-[#3A040A] border border-[#D4AF37]/20 p-8 rounded-xl shadow-2xl">
        <h1 className="font-serif text-3xl text-[#D4AF37] text-center mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Email</label>
            <input 
              type="email" 
              defaultValue="admin@example.com"
              className="w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Password</label>
            <input 
              type="password" 
              defaultValue="password"
              className="w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <Button type="submit" className="w-full">Masuk</Button>
        </form>
      </div>
    </div>
  );
}
