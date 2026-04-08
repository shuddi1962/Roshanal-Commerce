import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-blue text-white hover:bg-blue-600 shadow-sm hover:shadow-md",
        destructive: "bg-red text-white hover:bg-red-600 shadow-sm",
        outline: "border-2 border-gray-200 bg-white hover:bg-gray-50 text-text-1 hover:border-gray-300",
        secondary: "bg-gray-100 text-text-1 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 text-text-2",
        link: "text-blue underline-offset-4 hover:underline",
        cta: "bg-red text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
        navy: "bg-navy text-white hover:bg-navy/90 shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
