import type { ButtonHTMLAttributes, ReactNode } from "react";
import { uiButtonBaseClass, uiButtonSizeClassMap, uiButtonVariantClassMap } from "@/frontend/components/ui/classes";

type ButtonVariant = keyof typeof uiButtonVariantClassMap;
type ButtonSize = keyof typeof uiButtonSizeClassMap;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export default function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = [uiButtonBaseClass, uiButtonVariantClassMap[variant], uiButtonSizeClassMap[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
