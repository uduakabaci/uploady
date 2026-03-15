import { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "@/frontend/components/pagination";
import Button from "@/frontend/components/ui/button";
import Checkbox from "@/frontend/components/ui/checkbox";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const rowsPerPage = 4;
  const totalRows = recentFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedRows = recentFiles.slice(startIndex, startIndex + rowsPerPage);

  const visibleRowIds = useMemo(() => paginatedRows.map(row => row.id), [paginatedRows]);
  const selectedVisibleCount = visibleRowIds.filter(id => selectedIds.has(id)).length;
  const allVisibleSelected = visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  useEffect(() => {
    if (!openMenuRowId) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuContainerRef.current) return;
      if (menuContainerRef.current.contains(event.target as Node)) return;
      setOpenMenuRowId(null);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenuRowId(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [openMenuRowId]);

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

  const handleAction = (action: "view" | "rename" | "delete", row: FileRow) => {
    console.log(`[dashboard] ${action} file`, row);
    setOpenMenuRowId(null);
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
        <div className="grid gap-4 md:grid-cols-3">
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
          <div className="w-full max-w-sm">
            <Input placeholder="Search" />
          </div>
        </div>

        <div ref={menuContainerRef} className="overflow-x-auto rounded-[10px] border border-ui-6">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-ui-8 text-ui-2">
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allVisibleSelected}
                    onChange={toggleVisibleSelection}
                    ariaLabel="Select all visible files"
                    indeterminate={someVisibleSelected}
                  />
                </th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Date Uploaded</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Upload by</th>
                <th className="w-12 px-4 py-3 text-right"> </th>
              </tr>
            </thead>
            <tbody className="bg-ui-7 text-ui-3">
              {paginatedRows.map(row => (
                <tr key={row.id} className="border-t border-ui-6">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      ariaLabel={`Select ${row.fileName}`}
                    />
                  </td>
                  <td className="px-4 py-3">{row.fileName}</td>
                  <td className="px-4 py-3">{row.dateUploaded}</td>
                  <td className="px-4 py-3">{row.lastUpdated}</td>
                  <td className="px-4 py-3">{row.size}</td>
                  <td className="px-4 py-3">{row.uploadedBy}</td>
                  <td className="relative px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Open actions for ${row.fileName}`}
                      onClick={() => setOpenMenuRowId(prev => (prev === row.id ? null : row.id))}
                      className="border border-ui-6 bg-ui-8 px-2 py-1 text-ui-2 hover:bg-ui-6"
                    >
                      ⋮
                    </button>

                    {openMenuRowId === row.id ? (
                      <div className="absolute right-4 top-11 z-10 w-32 border border-ui-6 bg-ui-8 shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleAction("view", row)}
                          className="block w-full border-b border-ui-6 px-3 py-2 text-left text-xs text-ui-1 hover:bg-ui-7"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction("rename", row)}
                          className="block w-full border-b border-ui-6 px-3 py-2 text-left text-xs text-ui-1 hover:bg-ui-7"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction("delete", row)}
                          className="block w-full px-3 py-2 text-left text-xs text-red-3 hover:bg-ui-7"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalRows}
          pageSize={rowsPerPage}
          maxVisible={5}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}
