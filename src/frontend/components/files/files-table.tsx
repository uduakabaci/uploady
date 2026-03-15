import { FolderClosedIcon } from "@/frontend/components/icons/folder-icons";
import Checkbox from "@/frontend/components/ui/checkbox";
import type { UploadRow } from "@/frontend/components/files/types";

type FilesTableProps = {
  rows: UploadRow[];
  selectedIds: Set<string>;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onToggleVisibleSelection: () => void;
  onToggleRowSelection: (rowId: string) => void;
  onToggleRowMenu: (row: UploadRow, button: HTMLButtonElement) => void;
  onOpenFolder: (folderId: string) => void;
  onOpenRow: (row: UploadRow) => void;
};

export default function FilesTable({
  rows,
  selectedIds,
  allVisibleSelected,
  someVisibleSelected,
  onToggleVisibleSelection,
  onToggleRowSelection,
  onToggleRowMenu,
  onOpenFolder,
  onOpenRow,
}: FilesTableProps) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-ui-6">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-ui-8 text-ui-2">
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={allVisibleSelected}
                onChange={onToggleVisibleSelection}
                ariaLabel="Select all visible uploads"
                indeterminate={someVisibleSelected}
              />
            </th>
            <th className="px-4 py-3">File Name</th>
            <th className="hidden px-4 py-3 md:table-cell">Date Uploaded</th>
            <th className="hidden px-4 py-3 md:table-cell">Last Updated</th>
            <th className="px-4 py-3">Size</th>
            <th className="hidden px-4 py-3 md:table-cell">Upload by</th>
            <th className="w-12 px-4 py-3 text-right"> </th>
          </tr>
        </thead>
        <tbody className="bg-ui-7 text-ui-3">
          {rows.map(row => (
            <tr key={row.id} className="border-t border-ui-6">
              <td className="px-4 py-3">
                <Checkbox
                  checked={selectedIds.has(row.id)}
                  onChange={() => onToggleRowSelection(row.id)}
                  ariaLabel={`Select ${row.name}`}
                />
              </td>
              <td className="px-4 py-3">
                {row.kind === "folder" ? (
                  <button
                    type="button"
                    onClick={() => onOpenFolder(row.id)}
                    className="inline-flex items-center gap-2 text-ui-1 hover:text-ui-0"
                  >
                    <FolderClosedIcon className="size-4" />
                    <span>{row.name}</span>
                  </button>
                ) : (
                  <button type="button" onClick={() => onOpenRow(row)} className="text-ui-1 hover:text-ui-0">
                    {row.name}
                  </button>
                )}
              </td>
              <td className="hidden px-4 py-3 md:table-cell">{row.dateUploaded}</td>
              <td className="hidden px-4 py-3 md:table-cell">{row.lastUpdated}</td>
              <td className="px-4 py-3">{row.size}</td>
              <td className="hidden px-4 py-3 md:table-cell">{row.uploadedBy}</td>
              <td className="relative px-4 py-3 text-right">
                <button
                  type="button"
                  aria-label={`Open actions for ${row.name}`}
                  onClick={event => onToggleRowMenu(row, event.currentTarget)}
                  className="border border-ui-6 bg-ui-8 px-2 py-1 text-ui-2 hover:bg-ui-6"
                >
                  ⋮
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="border-t border-ui-6 px-4 py-8 text-center text-ui-4">
                No folders or files found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
