import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FolderClosedIcon } from "@/frontend/components/icons/folder-icons";
import Checkbox from "@/frontend/components/ui/checkbox";
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

type UploadRow =
  | {
      id: string;
      kind: "folder";
      name: string;
      parentId: string | null;
      dateUploaded: string;
      lastUpdated: string;
      size: string;
      uploadedBy: string;
      itemCount: number;
    }
  | {
      id: string;
      kind: "file";
      name: string;
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

export default function DashboardFilesPage() {
  const navigate = useNavigate();
  const params = useParams();
  const currentFolderId = params.folderId ?? ROOT_FOLDER_ID;

  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const folderById = useMemo(() => {
    return new Map(recentFolders.map(folder => [folder.id, folder]));
  }, []);

  useEffect(() => {
    if (currentFolderId === ROOT_FOLDER_ID) return;
    if (folderById.has(currentFolderId)) return;
    navigate("/dashboard/files", { replace: true });
  }, [currentFolderId, folderById, navigate]);

  useEffect(() => {
    setSelectedIds(new Set());
    setOpenMenuRowId(null);
  }, [currentFolderId, searchValue]);

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
    const folderRows: UploadRow[] = recentFolders
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

    const fileRows: UploadRow[] = recentFiles
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
  }, [currentFolderId, searchValue]);

  const visibleRowIds = useMemo(() => rows.map(row => row.id), [rows]);
  const selectedVisibleCount = visibleRowIds.filter(id => selectedIds.has(id)).length;
  const allVisibleSelected = visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

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

  const handleView = (row: UploadRow) => {
    if (row.kind === "folder") {
      navigate(`/dashboard/files/${row.id}`);
    }
    setOpenMenuRowId(null);
  };

  const handleAction = (action: "rename" | "delete", row: UploadRow) => {
    console.log(`[files] ${action}`, row);
    setOpenMenuRowId(null);
  };

  const navigateToCrumb = (folderId: string) => {
    if (folderId === ROOT_FOLDER_ID) {
      navigate("/dashboard/files");
      return;
    }

    navigate(`/dashboard/files/${folderId}`);
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

          <div className="w-full max-w-sm">
            <Input placeholder="Search" value={searchValue} onChange={event => setSearchValue(event.target.value)} />
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
                    ariaLabel="Select all visible uploads"
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
              {rows.map(row => (
                <tr key={row.id} className="border-t border-ui-6">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      ariaLabel={`Select ${row.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {row.kind === "folder" ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/files/${row.id}`)}
                        className="inline-flex items-center gap-2 text-ui-1 hover:text-ui-0"
                      >
                        <FolderClosedIcon className="size-4" />
                        <span>{row.name}</span>
                      </button>
                    ) : (
                      row.name
                    )}
                  </td>
                  <td className="px-4 py-3">{row.dateUploaded}</td>
                  <td className="px-4 py-3">{row.lastUpdated}</td>
                  <td className="px-4 py-3">{row.size}</td>
                  <td className="px-4 py-3">{row.uploadedBy}</td>
                  <td className="relative px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Open actions for ${row.name}`}
                      onClick={() => setOpenMenuRowId(prev => (prev === row.id ? null : row.id))}
                      className="border border-ui-6 bg-ui-8 px-2 py-1 text-ui-2 hover:bg-ui-6"
                    >
                      ⋮
                    </button>

                    {openMenuRowId === row.id ? (
                      <div className="absolute right-4 top-11 z-10 w-32 border border-ui-6 bg-ui-8 shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleView(row)}
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
      </section>
    </div>
  );
}
