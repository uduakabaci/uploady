import { useEffect, useRef } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  disabled?: boolean;
  ariaLabel: string;
};

export default function Checkbox({ checked, onChange, indeterminate = false, disabled = false, ariaLabel }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const showCheckmark = checked && !indeterminate;

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className="relative inline-flex cursor-pointer items-center justify-center">
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        disabled={disabled}
        className="h-[18px] w-[18px] appearance-none rounded-[4px] border border-ui-5 bg-ui-7 transition-colors checked:border-accent-cyan checked:bg-accent-cyan indeterminate:border-accent-cyan indeterminate:bg-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-4 disabled:cursor-not-allowed disabled:opacity-45"
      />

      {showCheckmark ? (
        <span className="pointer-events-none absolute text-[11px] leading-none text-white">✓</span>
      ) : null}

      {indeterminate ? (
        <span className="pointer-events-none absolute h-[2px] w-[10px] bg-white" />
      ) : null}
    </label>
  );
}
