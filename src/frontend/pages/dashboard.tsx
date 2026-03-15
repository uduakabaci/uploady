import { useEffect, useMemo, useState } from "react";
import FilesTable from "@/frontend/components/files/files-table";
import { CautionIcon, TrashIcon } from "@/frontend/components/icons/status-icons";
import ItemDetailsDrawer from "@/frontend/components/files/item-details-drawer";
import type { DetailSelection, UploadRow } from "@/frontend/components/files/types";
import Pagination from "@/frontend/components/pagination";
import Button from "@/frontend/components/ui/button";
import ConfirmModal from "@/frontend/components/ui/confirm-modal";
import Input from "@/frontend/components/ui/input";

type FileRow = {
  id: string;
  fileName: string;
  dateUploaded: string;
  lastUpdated: string;
  size: string;
  uploadedBy: string;
};

const metricCards = [
  { title: "Total Capacity", value: "48%", detail: "640 GB / 1 TB" },
  { title: "Cloud Storage", value: "78%", detail: "420 GB / 512 GB" },
  { title: "Shared Links", value: "124", detail: "18 expiring this week" },
];

const recentFiles: FileRow[] = [
  {
    id: "file-001",
    fileName: "Meeting_Notes_2023-10-01.txt",
    dateUploaded: "March 15, 2023",
    lastUpdated: "5 min ago",
    size: "2.5 GB",
    uploadedBy: "Emily Davis",
  },
  {
    id: "file-002",
    fileName: "Data_Analysis_Results.jpg",
    dateUploaded: "October 22, 2023",
    lastUpdated: "20 min ago",
    size: "1.2 GB",
    uploadedBy: "David Brown",
  },
  {
    id: "file-003",
    fileName: "Report_2023_Q1.pdf",
    dateUploaded: "February 5, 2024",
    lastUpdated: "30 min ago",
    size: "150 MB",
    uploadedBy: "Michael Smith",
  },
  {
    id: "file-004",
    fileName: "Invoice_#5678.docx",
    dateUploaded: "November 30, 2023",
    lastUpdated: "45 min ago",
    size: "300 MB",
    uploadedBy: "Jessica Wilson",
  },
  {
    id: "file-005",
    fileName: "Project_Overview_Presentation.ppt",
    dateUploaded: "July 15, 2023",
    lastUpdated: "23 min ago",
    size: "1.2 MB",
    uploadedBy: "Sarah Johnson",
  },
  {
    id: "file-006",
    fileName: "Team_Meeting_Audio.mp3",
    dateUploaded: "November 22, 2023",
    lastUpdated: "42 min ago",
    size: "500 KB",
    uploadedBy: "Daniel Garcia",
  },
  {
    id: "file-007",
    fileName: "Marketing_Strategy_Video.mp4",
    dateUploaded: "February 5, 2024",
    lastUpdated: "7 min ago",
    size: "2.5 MB",
    uploadedBy: "Sophie Reynolds",
  },
  {
    id: "file-008",
    fileName: "Budget_Analysis_Presentation.ppt",
    dateUploaded: "September 8, 2023",
    lastUpdated: "31 min ago",
    size: "300 KB",
    uploadedBy: "Ethan Carter",
  },
  {
    id: "file-009",
    fileName: "Contract_Renewal_2024.pdf",
    dateUploaded: "April 1, 2024",
    lastUpdated: "15 min ago",
    size: "6.4 MB",
    uploadedBy: "Amelia Wright",
  },
  {
    id: "file-010",
    fileName: "Roadmap_Q3_2025.docx",
    dateUploaded: "January 8, 2025",
    lastUpdated: "55 min ago",
    size: "1.9 MB",
    uploadedBy: "Olivia Moore",
  },
  {
    id: "file-011",
    fileName: "Client_Zeta_Assets.zip",
    dateUploaded: "May 11, 2024",
    lastUpdated: "12 min ago",
    size: "840 MB",
    uploadedBy: "Noah Turner",
  },
  {
    id: "file-012",
    fileName: "Onboarding_Checklist.txt",
    dateUploaded: "June 3, 2024",
    lastUpdated: "8 min ago",
    size: "210 KB",
    uploadedBy: "Emma Scott",
  },
];

export default function DashboardPage() {
  const [dashboardFiles, setDashboardFiles] = useState<FileRow[]>(recentFiles);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailSelection, setDetailSelection] = useState<DetailSelection | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<{
    row: UploadRow;
    x: number;
    y: number;
  } | null>(null);

  const rowsPerPage = 4;
  const totalRows = dashboardFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedRows = dashboardFiles.slice(startIndex, startIndex + rowsPerPage);

  const tableRows = useMemo<UploadRow[]>(
    () =>
      paginatedRows.map(row => ({
        id: row.id,
        kind: "file",
        name: row.fileName,
        parentId: "root",
        dateUploaded: row.dateUploaded,
        lastUpdated: row.lastUpdated,
        size: row.size,
        uploadedBy: row.uploadedBy,
      })),
    [paginatedRows],
  );

  const visibleRowIds = useMemo(() => tableRows.map(row => row.id), [tableRows]);
  const selectedVisibleCount = visibleRowIds.filter(id => selectedIds.has(id)).length;
  const allVisibleSelected = visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

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

  useEffect(() => {
    setOpenMenu(null);
  }, [safePage]);

  useEffect(() => {
    if (safePage === currentPage) return;
    setCurrentPage(safePage);
  }, [safePage, currentPage]);

  useEffect(() => {
    if (!detailSelection) return;

    const exists = tableRows.some(row => row.id === detailSelection.id);
    if (!exists) {
      setDetailSelection(null);
    }
  }, [detailSelection, tableRows]);

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

  const handleAction = (action: "view" | "rename" | "delete", row: UploadRow) => {
    if (action === "view") {
      setDetailSelection({
        kind: "file",
        id: row.id,
        name: row.name,
        uploadedBy: row.uploadedBy,
        dateUploaded: row.dateUploaded,
        lastUpdated: row.lastUpdated,
        size: row.size,
        sharedWith: [],
      });
    } else {
      console.log(`[dashboard] ${action} file`, row);
    }
    setOpenMenu(null);
  };

  const closeDetails = () => {
    setDetailSelection(null);
  };

  const deleteSelectedFiles = () => {
    const idsToDelete = new Set(selectedIds);
    setDashboardFiles(previous => previous.filter(file => !idsToDelete.has(file.id)));
    if (detailSelection && idsToDelete.has(detailSelection.id)) {
      setDetailSelection(null);
    }
    setSelectedIds(new Set());
    setOpenMenu(null);
    setDeleteConfirmOpen(false);
  };

  const handleDownload = () => {
    if (!detailSelection || detailSelection.kind !== "file") return;
    console.log(`[dashboard] download file`, detailSelection.id);
  };

  const toggleRowMenu = (row: UploadRow, button: HTMLButtonElement) => {
    setOpenMenu(previous => {
      if (previous && previous.row.id === row.id) {
        return null;
      }

      const menuWidth = 128;
      const menuHeight = 108;
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

  return (
    <div className="space-y-5">
      <section className="mt-[20px] mb-[60px]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-ui-0 text-2xl font-semibold">File Manager Dashboard</h1>
            <p className="text-ui-3 mt-1 text-sm">
              Currently managing 12 active projects with 4.2k files synced across cloud and local drives.
            </p>
          </div>
          <Button variant="secondary">Upload Files</Button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div>
          <div className="overflow-x-auto md:hidden">
            <div className="flex min-w-max gap-4 pb-1">
              {metricCards.map(card => (
                <article key={card.title} className="panel-solid min-w-[280px] p-4">
                  <p className="text-ui-3 text-sm">{card.title}</p>
                  <p className="text-ui-0 mt-3 text-3xl font-semibold">{card.value}</p>
                  <p className="text-ui-4 mt-1 text-sm">{card.detail}</p>
                  <div className="mt-4 h-2 bg-ui-8">
                    <div className="h-2 bg-secondary" style={{ width: card.value }} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="hidden gap-4 md:grid md:grid-cols-3 h-full">
            {metricCards.map(card => (
              <article key={card.title} className="panel-solid p-4">
                <p className="text-ui-3 text-sm">{card.title}</p>
                <p className="text-ui-0 mt-3 text-3xl font-semibold">{card.value}</p>
                <p className="text-ui-4 mt-1 text-sm">{card.detail}</p>
                <div className="mt-4 h-2 bg-ui-8">
                  <div className="h-2 bg-secondary" style={{ width: card.value }} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <article className="panel-solid p-4">
          <h2 className="text-ui-0 text-lg font-semibold">Storage Distribution</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <p className="flex items-center justify-between text-ui-3">
              Design Sources <span className="text-ui-0">280 GB</span>
            </p>
            <p className="flex items-center justify-between text-ui-3">
              Media Assets <span className="text-ui-0">140 GB</span>
            </p>
            <p className="flex items-center justify-between text-ui-3">
              Documents <span className="text-ui-0">40 GB</span>
            </p>
            <p className="flex items-center justify-between text-ui-3">
              Other <span className="text-ui-0">20 GB</span>
            </p>
          </div>
        </article>
      </section>

      <section className="mt-[40px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-ui-0 text-xl font-semibold">Uploaded Files</h2>
          <div className="flex w-full max-w-sm items-center justify-end gap-2">
            <Input placeholder="Search" />
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
          rows={tableRows}
          selectedIds={selectedIds}
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          onToggleVisibleSelection={toggleVisibleSelection}
          onToggleRowSelection={toggleRowSelection}
          onToggleRowMenu={toggleRowMenu}
          onOpenFolder={() => undefined}
          onOpenRow={row => handleAction("view", row)}
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalRows}
          pageSize={rowsPerPage}
          maxVisible={5}
          onPageChange={setCurrentPage}
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
              onClick={() => handleAction("view", openMenu.row)}
              className="block w-full border-b border-ui-6 px-3 py-2 text-left text-xs text-ui-1 hover:bg-ui-7"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => handleAction("rename", openMenu.row)}
              className="block w-full border-b border-ui-6 px-3 py-2 text-left text-xs text-ui-1 hover:bg-ui-7"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={() => handleAction("delete", openMenu.row)}
              className="block w-full px-3 py-2 text-left text-xs text-red-3 hover:bg-ui-7"
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}

      <ItemDetailsDrawer detailSelection={detailSelection} onClose={closeDetails} onDownload={handleDownload} />

      <ConfirmModal
        open={deleteConfirmOpen}
        title="Delete selected files?"
        description={`Delete ${selectedIds.size} selected file${selectedIds.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.size}`}
        icon={<CautionIcon className="size-5" />}
        onConfirm={deleteSelectedFiles}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
