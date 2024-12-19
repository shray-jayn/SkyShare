import { BasePrismaModel } from "../base-models/base-prisma-model"

export interface User extends BasePrismaModel{
  id :string ,
  email: string,
  name : string,
  usedStorage: bigint   
  storageQuota: bigint
}