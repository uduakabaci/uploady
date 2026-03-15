import type { SelectHTMLAttributes } from "react";
import { uiFieldHintClass, uiFieldInputClass, uiFieldLabelClass, uiFieldShellClass } from "@/frontend/components/ui/classes";

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
    <label className={uiFieldShellClass} htmlFor={resolvedId}>
      {label ? <span className={uiFieldLabelClass}>{label}</span> : null}
      <select id={resolvedId} className={[uiFieldInputClass, className].filter(Boolean).join(" ")} {...props}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className={uiFieldHintClass}>{hint}</span> : null}
    </label>
  );
}
