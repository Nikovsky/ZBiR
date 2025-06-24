// @file: packages/types/src/rbac.ts
import { UserRole } from "./user";

export enum AccessPreset {
  NON_LOGGED = "non_logged",
  LOGGED = "logged",
  MODERATORS = "moderators",
  ADMINS = "admins",
  ROOT = "root",
}

export const AccessMap: Record<AccessPreset, UserRole[]> = {
  [AccessPreset.NON_LOGGED]: [],

  [AccessPreset.LOGGED]: [
    UserRole.USER,
    UserRole.SKARBNIK,
    UserRole.SKARBNIK_REGION,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.SYSTEM,
  ],

  [AccessPreset.MODERATORS]: [
    UserRole.SKARBNIK,
    UserRole.SKARBNIK_REGION,
    UserRole.ADMIN,
    UserRole.ROOT,
    UserRole.SYSTEM,
  ],

  [AccessPreset.ADMINS]: [UserRole.ADMIN, UserRole.ROOT, UserRole.SYSTEM],

  [AccessPreset.ROOT]: [UserRole.ROOT, UserRole.SYSTEM],
};
