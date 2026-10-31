import type { Stadium } from "./stadium";

// 1. data club form
export interface Club {
  points: number;
  _id: string;
  name_club: string;
  logo: string | null;
  stadium: Stadium | null;
  district: string | null;
  penalty_applied: boolean;
  createdAt?: string;
  updatedAt?: string;
}
