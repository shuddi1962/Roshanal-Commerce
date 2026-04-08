import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-syne font-bold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue text-white",
        sale: "bg-red text-white",
        hot: "bg-orange-500 text-white",
        new: "bg-success text-white",
        featured: "bg-blue text-white",
        trending: "bg-purple-600 text-white",
        bestseller: "bg-amber-500 text-white",
        "top-rated": "bg-yellow-500 text-text-1",
        outline: "border border-border text-text-2",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        navy: "bg-navy text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
