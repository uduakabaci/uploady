import type { ShareLink } from "@/shared/types";

export class ShareService {
  async create(_fileId: string, _expiresAt: string | null = null): Promise<ShareLink | null> {
    return null;
  }

  async resolve(_token: string): Promise<ShareLink | null> {
    return null;
  }
}
