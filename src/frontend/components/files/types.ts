export type ShareEntry = {
  name: string;
  email: string;
  access: "Viewer" | "Editor";
};

export type UploadRow =
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

export type DetailSelection =
  | {
      kind: "folder";
      id: string;
      name: string;
      uploadedBy: string;
      dateUploaded: string;
      lastUpdated: string;
      size: string;
      filesInside: number;
      subfoldersInside: number;
      sharedWith: ShareEntry[];
    }
  | {
      kind: "file";
      id: string;
      name: string;
      uploadedBy: string;
      dateUploaded: string;
      lastUpdated: string;
      size: string;
      sharedWith: ShareEntry[];
    };
