import { useEffect } from "react";
import { DownloadIcon } from "@/frontend/components/icons/status-icons";
import type { DetailSelection } from "@/frontend/components/files/types";

type ItemDetailsDrawerProps = {
  detailSelection: DetailSelection | null;
  onClose: () => void;
  onDownload: () => void;
};

export default function ItemDetailsDrawer({ detailSelection, onClose, onDownload }: ItemDetailsDrawerProps) {
  useEffect(() => {
    if (!detailSelection) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [detailSelection, onClose]);

  if (!detailSelection) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close details modal"
        className="absolute inset-0 bg-black/35"
      />

      <aside className="absolute inset-x-0 bottom-0 z-10 max-h-[86vh] overflow-y-auto rounded-t-[14px] border border-ui-6 bg-ui-7 p-4 md:inset-x-auto md:top-0 md:right-0 md:h-screen md:max-h-none md:w-[420px] md:rounded-none md:border-y-0 md:border-r-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-ui-0 text-lg font-semibold">Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="border border-ui-6 bg-ui-8 px-2 py-1 text-xs text-ui-2 hover:bg-ui-7"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Name</p>
            <p className="text-ui-1 mt-1 break-all">{detailSelection.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Type</p>
              <p className="text-ui-1 mt-1">{detailSelection.kind === "folder" ? "Folder" : "File"}</p>
            </div>
            <div>
              <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Size</p>
              <p className="text-ui-1 mt-1">{detailSelection.size}</p>
            </div>
          </div>

          {detailSelection.kind === "folder" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Files Inside</p>
                <p className="text-ui-1 mt-1">{detailSelection.filesInside}</p>
              </div>
              <div>
                <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Subfolders</p>
                <p className="text-ui-1 mt-1">{detailSelection.subfoldersInside}</p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 border border-ui-6 bg-ui-8 px-3 py-2 text-sm text-ui-1 hover:bg-ui-7"
            >
              <DownloadIcon className="size-4" />
              Download
            </button>
          )}

          <div>
            <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Uploaded By</p>
            <p className="text-ui-1 mt-1">{detailSelection.uploadedBy}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Date Uploaded</p>
              <p className="text-ui-1 mt-1">{detailSelection.dateUploaded}</p>
            </div>
            <div>
              <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Last Updated</p>
              <p className="text-ui-1 mt-1">{detailSelection.lastUpdated}</p>
            </div>
          </div>

          <div>
            <p className="text-ui-4 text-xs uppercase tracking-[0.08em]">Shared With</p>
            {detailSelection.sharedWith.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {detailSelection.sharedWith.map(entry => (
                  <li key={`${detailSelection.id}-${entry.email}`} className="border border-ui-6 bg-ui-8 px-2 py-2">
                    <p className="text-ui-1 text-sm">{entry.name}</p>
                    <p className="text-ui-4 text-xs">{entry.email}</p>
                    <p className="text-ui-3 mt-1 text-xs">{entry.access}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ui-4 mt-1">Only you</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
