export interface AuthResponse {
    message: string;
    user: {
      id: string;
      email: string;
      name?: string;
      usedStorage: bigint;
      storageQuota: bigint;
      createdAt: Date;
      updatedAt: Date;
    };
    token: string;
  }
  