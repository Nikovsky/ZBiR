// @file: packages/types/src/user.ts
export enum UserRole {
  ROOT = "ROOT",
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
  SKARBNIK = "SKARBNIK",
  SKARBNIK_REGION = "SKARBNIK_REGION",
  USER = "USER",
}

enum UserRegion {
  DOLNOSLASKI = "DOLNOŚLĄSKI",
  GORNOSLASKI = "GÓRNOŚLĄSKI",
  KUJAWSKO_POMORSKI = "KUJAWSKO-POMORSKI",
  LUBELSKI = "LUBELSKI",
  LODZKI = "ŁÓDZKI",
  MALOPOLSKI = "MAŁOPOLSKI",
  MAZOWIECKI = "MAZOWIECKI",
  PODKARPACKI = "PODKARPACKI",
  POMORSKI = "POMORSKI",
  POLNOCNO_ZACHODNI = "PÓŁNOCNO-ZACHODNI",
  STAROPOLSKI = "STAROPOLSKI",
  WIELKOPOLSKI = "WIELKOPOLSKI",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface SessionResponse {
  id: string;
  email: string;
  role: UserRole;
  exp: number; // expiry timestamp (z tokena)
  iat: number; // issued at
}
