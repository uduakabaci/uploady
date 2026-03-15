import { useEffect, type ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  icon,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label="Close confirm modal" className="absolute inset-0 bg-black/45" onClick={onCancel} />

      <div className="absolute inset-x-4 top-1/2 mx-auto w-full max-w-md -translate-y-1/2 border border-ui-6 bg-ui-7 p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          {icon ? <div className="mt-0.5 text-red-3">{icon}</div> : null}
          <div>
            <h3 className="text-ui-0 text-lg font-semibold">{title}</h3>
            <p className="text-ui-3 mt-1 text-sm">{description}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border border-ui-6 bg-ui-8 px-3 py-2 text-sm text-ui-2 hover:bg-ui-7"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border border-red-4 bg-red-4 px-3 py-2 text-sm text-ui-0 hover:border-red-3 hover:bg-red-3"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
