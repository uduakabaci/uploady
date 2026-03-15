import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import FilesTable from "@/frontend/components/files/files-table";
import { CautionIcon, TrashIcon } from "@/frontend/components/icons/status-icons";
import ItemDetailsDrawer from "@/frontend/components/files/item-details-drawer";
import type { ShareEntry, UploadRow } from "@/frontend/components/files/types";
import Button from "@/frontend/components/ui/button";
import ConfirmModal from "@/frontend/components/ui/confirm-modal";
import Input from "@/frontend/components/ui/input";

const ROOT_FOLDER_ID = "root";

type FolderRow = {
  id: string;
  folderName: string;
  parentId: string | null;
  dateUploaded: string;
  lastUpdated: string;
  uploadedBy: string;
  itemCount: number;
};

type FileRow = {
  id: string;
  fileName: string;
  parentId: string;
  dateUploaded: string;
  lastUpdated: string;
  size: string;
  uploadedBy: string;
};


const recentFolders: FolderRow[] = [
  {
    id: "folder-brand-assets",
    folderName: "Brand Assets",
    parentId: ROOT_FOLDER_ID,
    dateUploaded: "March 2, 2024",
    lastUpdated: "12 min ago",
    uploadedBy: "Emily Davis",
    itemCount: 18,
  },
  {
    id: "folder-campaigns",
    folderName: "Campaigns",
    parentId: ROOT_FOLDER_ID,
    dateUploaded: "April 4, 2024",
    lastUpdated: "21 min ago",
    uploadedBy: "Sophie Reynolds",
    itemCount: 11,
  },
  {
    id: "folder-legal",
    folderName: "Legal",
    parentId: ROOT_FOLDER_ID,
    dateUploaded: "January 12, 2024",
    lastUpdated: "1 hour ago",
    uploadedBy: "David Brown",
    itemCount: 9,
  },
  {
    id: "folder-q2-launch",
    folderName: "Q2 Launch",
    parentId: "folder-campaigns",
    dateUploaded: "May 10, 2024",
    lastUpdated: "9 min ago",
    uploadedBy: "Sophie Reynolds",
    itemCount: 7,
  },
  {
    id: "folder-social-kits",
    folderName: "Social Kits",
    parentId: "folder-campaigns",
    dateUploaded: "May 19, 2024",
    lastUpdated: "44 min ago",
    uploadedBy: "Ethan Carter",
    itemCount: 6,
  },
  {
    id: "folder-nda",
    folderName: "NDA",
    parentId: "folder-legal",
    dateUploaded: "February 2, 2024",
    lastUpdated: "2 days ago",
    uploadedBy: "Jessica Wilson",
    itemCount: 4,
  },
];

const recentFiles: FileRow[] = [
  {
    id: "file-001",
    fileName: "Meeting_Notes_2023-10-01.txt",
    parentId: ROOT_FOLDER_ID,
    dateUploaded: "March 15, 2023",
    lastUpdated: "5 min ago",
    size: "2.5 GB",
    uploadedBy: "Emily Davis",
  },
  {
    id: "file-002",
    fileName: "Data_Analysis_Results.jpg",
    parentId: ROOT_FOLDER_ID,
    dateUploaded: "October 22, 2023",
    lastUpdated: "20 min ago",
    size: "1.2 GB",
    uploadedBy: "David Brown",
  },
  {
    id: "file-003",
    fileName: "Report_2023_Q1.pdf",
    parentId: "folder-legal",
    dateUploaded: "February 5, 2024",
    lastUpdated: "30 min ago",
    size: "150 MB",
    uploadedBy: "Michael Smith",
  },
  {
    id: "file-004",
    fileName: "Invoice_5678.docx",
    parentId: "folder-legal",
    dateUploaded: "November 30, 2023",
    lastUpdated: "45 min ago",
    size: "300 MB",
    uploadedBy: "Jessica Wilson",
  },
  {
    id: "file-005",
    fileName: "Project_Overview_Presentation.ppt",
    parentId: "folder-brand-assets",
    dateUploaded: "July 15, 2023",
    lastUpdated: "23 min ago",
    size: "1.2 MB",
    uploadedBy: "Sarah Johnson",
  },
  {
    id: "file-006",
    fileName: "Team_Meeting_Audio.mp3",
    parentId: "folder-brand-assets",
    dateUploaded: "November 22, 2023",
    lastUpdated: "42 min ago",
    size: "500 KB",
    uploadedBy: "Daniel Garcia",
  },
  {
    id: "file-007",
    fileName: "Marketing_Strategy_Video.mp4",
    parentId: "folder-q2-launch",
    dateUploaded: "February 5, 2024",
    lastUpdated: "7 min ago",
    size: "2.5 MB",
    uploadedBy: "Sophie Reynolds",
  },
  {
    id: "file-008",
    fileName: "Budget_Analysis_Presentation.ppt",
    parentId: "folder-social-kits",
    dateUploaded: "September 8, 2023",
    lastUpdated: "31 min ago",
    size: "300 KB",
    uploadedBy: "Ethan Carter",
  },
  {
    id: "file-009",
    fileName: "Contract_Renewal_2024.pdf",
    parentId: "folder-nda",
    dateUploaded: "April 1, 2024",
    lastUpdated: "15 min ago",
    size: "6.4 MB",
    uploadedBy: "Amelia Wright",
  },
];

const sharedWithByItemId: Record<string, ShareEntry[]> = {
  "folder-brand-assets": [
    { name: "Jordan Lee", email: "jordan.lee@uploady.app", access: "Editor" },
    { name: "Mina Park", email: "mina.park@uploady.app", access: "Viewer" },
  ],
  "folder-campaigns": [{ name: "Sophie Reynolds", email: "sophie@uploady.app", access: "Editor" }],
  "folder-legal": [{ name: "Legal Team", email: "legal@uploady.app", access: "Viewer" }],
  "file-002": [{ name: "David Brown", email: "david@uploady.app", access: "Editor" }],
  "file-007": [
    { name: "Growth Team", email: "growth@uploady.app", access: "Viewer" },
    { name: "Sophie Reynolds", email: "sophie@uploady.app", access: "Editor" },
  ],
};

function parseSizeToBytes(size: string): number {
  const match = size.trim().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i);
  if (!match) return 0;

  const value = Number(match[1]);
  const unit = match[2].toUpperCase();
  const unitFactorMap: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  return Math.round(value * (unitFactorMap[unit] ?? 1));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function DashboardFilesPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFolderId = params.folderId ?? ROOT_FOLDER_ID;

  const [foldersState, setFoldersState] = useState<FolderRow[]>(recentFolders);
  const [filesState, setFilesState] = useState<FileRow[]>(recentFiles);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<{
    row: UploadRow;
    x: number;
    y: number;
  } | null>(null);

  const folderById = useMemo(() => new Map(foldersState.map(folder => [folder.id, folder])), [foldersState]);
  const fileById = useMemo(() => new Map(filesState.map(file => [file.id, file])), [filesState]);

  const folderIdsByParent = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const folder of foldersState) {
      const parentKey = folder.parentId ?? ROOT_FOLDER_ID;
      const existing = map.get(parentKey) ?? [];
      existing.push(folder.id);
      map.set(parentKey, existing);
    }
    return map;
  }, [foldersState]);

  useEffect(() => {
    if (currentFolderId === ROOT_FOLDER_ID) return;
    if (folderById.has(currentFolderId)) return;
    navigate("/dashboard/files", { replace: true });
  }, [currentFolderId, folderById, navigate]);

  useEffect(() => {
    setSelectedIds(new Set());
    setOpenMenu(null);
  }, [currentFolderId, searchValue]);

  useEffect(() => {
    if (!openMenu) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [openMenu]);

  const breadcrumbs = useMemo(() => {
    const trail: { id: string; label: string }[] = [{ id: ROOT_FOLDER_ID, label: "Files" }];

    if (currentFolderId === ROOT_FOLDER_ID) {
      return trail;
    }

    const stack: { id: string; label: string }[] = [];
    let pointer = folderById.get(currentFolderId) ?? null;

    while (pointer) {
      stack.push({ id: pointer.id, label: pointer.folderName });
      if (!pointer.parentId || pointer.parentId === ROOT_FOLDER_ID) break;
      pointer = folderById.get(pointer.parentId) ?? null;
    }

    stack.reverse().forEach(item => trail.push(item));
    return trail;
  }, [currentFolderId, folderById]);

  const rows = useMemo<UploadRow[]>(() => {
    const folderRows: UploadRow[] = foldersState
      .filter(folder => folder.parentId === currentFolderId)
      .map(folder => ({
        id: folder.id,
        kind: "folder",
        name: folder.folderName,
        parentId: folder.parentId,
        dateUploaded: folder.dateUploaded,
        lastUpdated: folder.lastUpdated,
        size: `${folder.itemCount} items`,
        uploadedBy: folder.uploadedBy,
        itemCount: folder.itemCount,
      }));

    const fileRows: UploadRow[] = filesState
      .filter(file => file.parentId === currentFolderId)
      .map(file => ({
        id: file.id,
        kind: "file",
        name: file.fileName,
        parentId: file.parentId,
        dateUploaded: file.dateUploaded,
        lastUpdated: file.lastUpdated,
        size: file.size,
        uploadedBy: file.uploadedBy,
      }));

    return [...folderRows, ...fileRows]
      .filter(row => row.name.toLowerCase().includes(searchValue.trim().toLowerCase()))
      .sort((a, b) => {
        if (a.kind !== b.kind) {
          return a.kind === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  }, [currentFolderId, searchValue, foldersState, filesState]);

  const visibleRowIds = useMemo(() => rows.map(row => row.id), [rows]);
  const selectedVisibleCount = visibleRowIds.filter(id => selectedIds.has(id)).length;
  const allVisibleSelected = visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  const allFolderDescendantsById = useMemo(() => {
    const map = new Map<string, string[]>();

    for (const folder of foldersState) {
      const descendants: string[] = [];
      const stack = [...(folderIdsByParent.get(folder.id) ?? [])];

      while (stack.length > 0) {
        const currentId = stack.pop();
        if (!currentId) continue;
        descendants.push(currentId);
        const childFolderIds = folderIdsByParent.get(currentId) ?? [];
        for (const childId of childFolderIds) {
          stack.push(childId);
        }
      }

      map.set(folder.id, descendants);
    }

    return map;
  }, [folderIdsByParent, foldersState]);

  const fileBytesById = useMemo(() => {
    const map = new Map<string, number>();
    for (const file of filesState) {
      map.set(file.id, parseSizeToBytes(file.size));
    }
    return map;
  }, [filesState]);

  const detailSelection = useMemo(() => {
    const itemType = searchParams.get("itemType");
    const itemId = searchParams.get("itemId");
    if (!itemType || !itemId) return null;

    if (itemType === "folder") {
      const folder = folderById.get(itemId);
      if (!folder) return null;

      const directFilesCount = filesState.filter(file => file.parentId === folder.id).length;
      const directSubfoldersCount = foldersState.filter(candidate => candidate.parentId === folder.id).length;
      const descendantFolderIds = allFolderDescendantsById.get(folder.id) ?? [];
      const effectiveFolderIds = new Set([folder.id, ...descendantFolderIds]);
      const totalBytes = filesState
        .filter(file => effectiveFolderIds.has(file.parentId))
        .reduce((sum, file) => sum + (fileBytesById.get(file.id) ?? 0), 0);

      return {
        kind: "folder" as const,
        id: folder.id,
        name: folder.folderName,
        uploadedBy: folder.uploadedBy,
        dateUploaded: folder.dateUploaded,
        lastUpdated: folder.lastUpdated,
        size: formatBytes(totalBytes),
        filesInside: directFilesCount,
        subfoldersInside: directSubfoldersCount,
        sharedWith: sharedWithByItemId[folder.id] ?? [],
      };
    }

    if (itemType === "file") {
      const file = fileById.get(itemId);
      if (!file) return null;

      return {
        kind: "file" as const,
        id: file.id,
        name: file.fileName,
        uploadedBy: file.uploadedBy,
        dateUploaded: file.dateUploaded,
        lastUpdated: file.lastUpdated,
        size: file.size,
        sharedWith: sharedWithByItemId[file.id] ?? [],
      };
    }

    return null;
  }, [searchParams, folderById, fileById, allFolderDescendantsById, fileBytesById, filesState, foldersState]);

  useEffect(() => {
    const itemType = searchParams.get("itemType");
    const itemId = searchParams.get("itemId");
    if (!itemType && !itemId) return;

    const isValidType = itemType === "file" || itemType === "folder";
    if (!isValidType || !detailSelection) {
      const next = new URLSearchParams(searchParams);
      next.delete("itemType");
      next.delete("itemId");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, detailSelection, setSearchParams]);

  const toggleRowSelection = (rowId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const toggleVisibleSelection = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleRowIds.forEach(id => next.delete(id));
      } else {
        visibleRowIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const navigateToCrumb = (folderId: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("itemType");
    next.delete("itemId");

    if (folderId === ROOT_FOLDER_ID) {
      navigate(`/dashboard/files${next.size ? `?${next.toString()}` : ""}`);
      return;
    }

    navigate(`/dashboard/files/${folderId}${next.size ? `?${next.toString()}` : ""}`);
  };

  const openDetails = (row: UploadRow) => {
    const next = new URLSearchParams(searchParams);
    next.set("itemType", row.kind);
    next.set("itemId", row.id);
    setSearchParams(next);
    setOpenMenu(null);
  };

  const openRow = (row: UploadRow) => {
    if (row.kind === "folder") {
      const next = new URLSearchParams(searchParams);
      next.delete("itemType");
      next.delete("itemId");
      navigate(`/dashboard/files/${row.id}${next.size ? `?${next.toString()}` : ""}`);
      setOpenMenu(null);
      return;
    }

    openDetails(row);
  };

  const closeDetails = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("itemType");
    next.delete("itemId");
    setSearchParams(next);
  };

  const toggleRowMenu = (row: UploadRow, button: HTMLButtonElement) => {
    setOpenMenu(previous => {
      if (previous && previous.row.id === row.id) {
        return null;
      }

      const menuWidth = 128;
      const menuHeight = 76;
      const spacing = 8;
      const rect = button.getBoundingClientRect();
      const openUpward = window.innerHeight - rect.bottom < menuHeight + spacing;
      const x = Math.max(spacing, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - spacing));
      const y = openUpward ? rect.top - menuHeight - spacing : rect.bottom + spacing;

      return {
        row,
        x,
        y: Math.max(spacing, y),
      };
    });
  };

  const handleDownload = () => {
    if (!detailSelection || detailSelection.kind !== "file") return;
    console.log(`[files] download`, detailSelection.id);
  };

  const deleteSelectedItems = () => {
    const selected = new Set(selectedIds);
    const selectedFolderIds = new Set(
      [...selected].filter(id => {
        const row = rows.find(candidate => candidate.id === id);
        return row?.kind === "folder";
      }),
    );

    const descendantFolderIds = new Set<string>();
    const stack = [...selectedFolderIds];
    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!currentId) continue;
      const childFolderIds = folderIdsByParent.get(currentId) ?? [];
      for (const childId of childFolderIds) {
        if (descendantFolderIds.has(childId) || selectedFolderIds.has(childId)) continue;
        descendantFolderIds.add(childId);
        stack.push(childId);
      }
    }

    const allFolderIdsToDelete = new Set([...selectedFolderIds, ...descendantFolderIds]);

    setFoldersState(previous =>
      previous.filter(folder => {
        if (selected.has(folder.id)) return false;
        if (allFolderIdsToDelete.has(folder.id)) return false;
        return true;
      }),
    );

    setFilesState(previous =>
      previous.filter(file => {
        if (selected.has(file.id)) return false;
        if (allFolderIdsToDelete.has(file.parentId)) return false;
        return true;
      }),
    );

    if (detailSelection) {
      const detailRemoved = selected.has(detailSelection.id) || allFolderIdsToDelete.has(detailSelection.id);
      if (detailRemoved) {
        closeDetails();
      }
    }

    if (allFolderIdsToDelete.has(currentFolderId)) {
      navigate("/dashboard/files");
    }

    setSelectedIds(new Set());
    setOpenMenu(null);
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-5">
      <section className="mt-[20px] mb-[60px]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-ui-0 text-2xl font-semibold">Files</h1>
            <p className="text-ui-3 mt-1 text-sm">Browse folders and files with route-based navigation.</p>
          </div>
        </div>
      </section>

      <section className="mt-[40px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={crumb.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateToCrumb(crumb.id)}
                    className={[
                      "border border-ui-6 px-2 py-1 text-xs",
                      isLast ? "bg-ui-7 text-ui-0" : "bg-ui-8 text-ui-3 hover:bg-ui-7 hover:text-ui-0",
                    ].join(" ")}
                    disabled={isLast}
                  >
                    {crumb.label}
                  </button>
                  {isLast ? null : <span className="text-ui-5">/</span>}
                </div>
              );
            })}
          </div>

          <div className="flex w-full max-w-sm items-center justify-end gap-2">
            <Input placeholder="Search" value={searchValue} onChange={event => setSearchValue(event.target.value)} />
            {selectedIds.size > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
                className="border-red-4 bg-red-4 text-ui-0 hover:border-red-3 hover:bg-red-3"
              >
                <TrashIcon className="size-4" />
                Delete ({selectedIds.size})
              </Button>
            ) : null}
          </div>
        </div>

        <FilesTable
          rows={rows}
          selectedIds={selectedIds}
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          onToggleVisibleSelection={toggleVisibleSelection}
          onToggleRowSelection={toggleRowSelection}
          onToggleRowMenu={toggleRowMenu}
          onOpenFolder={folderId => navigate(`/dashboard/files/${folderId}`)}
          onOpenRow={openRow}
        />
      </section>

      {openMenu ? (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-transparent"
            aria-label="Close actions menu"
            onClick={() => setOpenMenu(null)}
          />
          <div
            className="absolute z-50 w-32 border border-ui-6 bg-ui-8 shadow-lg"
            style={{ left: `${openMenu.x}px`, top: `${openMenu.y}px` }}
          >
            <button
              type="button"
              onClick={() => openRow(openMenu.row)}
              className="block w-full border-b border-ui-6 px-3 py-2 text-left text-xs text-ui-1 hover:bg-ui-7"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => openDetails(openMenu.row)}
              className="block w-full px-3 py-2 text-left text-xs text-ui-1 hover:bg-ui-7"
            >
              Details
            </button>
          </div>
        </div>
      ) : null}

      <ItemDetailsDrawer detailSelection={detailSelection} onClose={closeDetails} onDownload={handleDownload} />

      <ConfirmModal
        open={deleteConfirmOpen}
        title="Delete selected items?"
        description={`Delete ${selectedIds.size} selected item${selectedIds.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.size}`}
        icon={<CautionIcon className="size-5" />}
        onConfirm={deleteSelectedItems}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
