import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

// ponytail: Just a simple button component instead of full class-variance-authority for now
export function Button({ 
  className = "", 
  variant = "primary", 
  asChild = false,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline", asChild?: boolean }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-primary disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-6 py-2";
  
  const variants = {
    primary: "bg-gold-primary text-maroon-base hover:bg-gold-glow active:scale-[0.98]",
    outline: "border border-gold-primary text-gold-primary hover:bg-gold-primary/10 active:scale-[0.98]"
  };

  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
