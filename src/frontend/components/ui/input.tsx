import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export default function Input({ label, hint, id, className, ...props }: InputProps) {
  const resolvedId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="field-shell" htmlFor={resolvedId}>
      {label ? <span className="field-label">{label}</span> : null}
      <input id={resolvedId} className={["field-input", className].filter(Boolean).join(" ")} {...props} />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}
