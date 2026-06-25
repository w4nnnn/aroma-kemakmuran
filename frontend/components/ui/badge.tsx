export function Badge({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" | "neutral" }) {
  const variants = {
    default: "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30",
    success: "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30",
    neutral: "bg-gray-800 text-gray-300 border border-gray-600"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
