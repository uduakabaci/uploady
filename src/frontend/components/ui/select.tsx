import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  hint?: string;
  options: SelectOption[];
};

export default function Select({ label, hint, id, className, options, ...props }: SelectProps) {
  const resolvedId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="field-shell" htmlFor={resolvedId}>
      {label ? <span className="field-label">{label}</span> : null}
      <select id={resolvedId} className={["field-input", className].filter(Boolean).join(" ")} {...props}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}
