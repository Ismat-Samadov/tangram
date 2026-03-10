"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const variants = {
  primary:
    "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30",
  secondary:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm",
  danger:
    "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/30",
  ghost: "hover:bg-white/10 text-white/70 hover:text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-8 py-3.5 text-lg rounded-2xl font-semibold",
};

export default function Button({
  variant = "primary",
  size = "md",
  glow = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? "ring-2 ring-purple-400/50" : ""}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        font-medium transition-all duration-150 select-none
        ${className}
      `}
      disabled={disabled}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
