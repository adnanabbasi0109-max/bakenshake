"use client";
import { forwardRef, ButtonHTMLAttributes, MouseEvent } from "react";
import Link from "next/link";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  href?: string;
  onClick?: (e: MouseEvent) => void;
}

type ButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, href, onClick, className = "", children, ...props }, ref) => {
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

    const classes = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

    if (href) {
      return (
        <Link href={href} className={classes} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
