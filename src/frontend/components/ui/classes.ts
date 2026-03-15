export const uiFieldShellClass = "flex flex-col gap-1.5";
export const uiFieldLabelClass =
  "font-['Hanken_Grotesk'] text-xs font-bold uppercase tracking-[0.02em] text-primary";
export const uiFieldHintClass = "text-xs text-ui-4";
export const uiFieldInputClass =
  "w-full rounded-[10px] border border-ui-6 bg-ui-7 px-3 py-2.5 text-sm text-white outline-none placeholder:text-ui-4 focus:border-ui-5";

export const uiButtonBaseClass =
  "inline-flex items-center justify-center rounded-[8px] border font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer uppercase";

export const uiButtonVariantClassMap = {
  primary:
    "bg-ui-2 text-ui-5 hover:bg-ui-4 hover:text-ui-6",
  secondary:
    "border-ui-6 bg-ui-7 text-ui-2 hover:bg-ui-6",
  outline: "",
} as const;

export const uiButtonSizeClassMap = {
  sm: "px-3 py-2 text-sm",
  md: "px-[10px] py-[12px] text-sm",
  lg: "px-5 py-3 text-base",
} as const;
