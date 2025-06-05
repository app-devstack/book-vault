import { StoreKey } from "./book";

export interface Store {
  name: string;
  color: string;
  url: string;
}

export type Stores = Record<StoreKey, Store>;

export interface TabType {
  key: string;
  label: string;
  icon: string;
}

export type ActiveTab = "home" | "register" | "settings";
export type RegisterTab = "gmail" | "api";
