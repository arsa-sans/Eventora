import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.4)] hover:scale-[1.02]",
        outline:
          "border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary-50 hover:border-primary-dark",
        ghost:
          "bg-transparent text-muted hover:bg-primary-50 hover:text-primary",
        accent:
          "bg-accent-rose text-white shadow-[0_4px_14px_rgba(244,63,94,0.3)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.4)] hover:scale-[1.02]",
        secondary:
          "bg-primary-light text-primary-dark hover:bg-primary/20",
        white:
          "bg-white text-primary shadow-sm hover:bg-primary-50 hover:scale-[1.02]",
      },
      size: {
        sm:      "h-9  px-4  text-sm  rounded-full",
        default: "h-11 px-6  text-base rounded-full",
        lg:      "h-13 px-8  text-base rounded-full",
        xl:      "h-14 px-10 text-lg  rounded-full",
        icon:    "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

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
