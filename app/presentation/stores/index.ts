import type { UserData } from "app/shared/types";
import { atom } from "jotai";

export const phoneMenu = {
  isOpen: atom(false),
};

export const userDataStore = atom<UserData | null>(null);
