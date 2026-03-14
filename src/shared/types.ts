export type HealthStatus = "ok";

export type HealthPayload = {
  status: HealthStatus;
  service: string;
  timestamp: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  refreshExpiresAt: Date;
  revokedAt: Date | null;
};

export type ObjectStorageConfig = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type StoredFile = {
  id: string;
  ownerId: string;
  objectKey: string;
  fileName: string;
  contentType: string;
  size: number;
  createdAt: string;
};

export type ShareLink = {
  token: string;
  fileId: string;
  createdAt: string;
  expiresAt: string | null;
};
