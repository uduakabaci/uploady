import type { InputHTMLAttributes } from "react";
import { uiFieldHintClass, uiFieldInputClass, uiFieldLabelClass, uiFieldShellClass } from "@/frontend/components/ui/classes";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  placeholder?: string;
};

export default function Input({ label, hint, id, className, placeholder, ...props }: InputProps) {
  const resolvedId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className={uiFieldShellClass} htmlFor={resolvedId}>
      {label ? <span className={uiFieldLabelClass}>{label}</span> : null}
      <input
        id={resolvedId}
        className={[uiFieldInputClass, className].filter(Boolean).join(" ")} {...props}
        placeholder={placeholder}
      />
      {hint ? <span className={uiFieldHintClass}>{hint}</span> : null}
    </label>
  );
}
