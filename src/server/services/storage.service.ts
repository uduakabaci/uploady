import type { ObjectStorageConfig } from "@/shared/types";

export class StorageService {
  constructor(private readonly config: ObjectStorageConfig) {}

  getConfig() {
    return this.config;
  }

  async checkConnection(): Promise<boolean> {
    return false;
  }
}
