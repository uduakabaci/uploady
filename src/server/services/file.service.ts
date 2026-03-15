import type { StoredFile } from "@/shared/types";

export class FileService {
  async listByOwner(_ownerId: string): Promise<StoredFile[]> {
    return [];
  }

  async getById(_id: string): Promise<StoredFile | null> {
    return null;
  }
}
