type IconProps = {
  className?: string;
  strokeWidth?: number;
};

export function CheckIcon({ className = "size-4", strokeWidth = 1.5 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

export function MinusIcon({ className = "size-4", strokeWidth = 1.5 }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}
