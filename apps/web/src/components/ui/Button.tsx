"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className = "", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-body font-semibold rounded-brand transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-brand-red text-white hover:bg-brand-red-dark active:scale-[0.98] shadow-sm",
      secondary: "bg-brand-sage text-text-primary hover:bg-brand-sage-dark active:scale-[0.98]",
      outline:
        "border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white active:scale-[0.98]",
      ghost: "text-brand-red hover:bg-brand-red/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
