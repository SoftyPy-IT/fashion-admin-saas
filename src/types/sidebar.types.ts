import { ReactNode } from "react";

export type TContainer = {
  children: ReactNode;
  className?: string;
};

export type TRoute = {
  path: string;
  element: ReactNode;
  icon?: ReactNode;
};
export type TSidebarItem =
  | {
      key: string;
      label: ReactNode;
      children?: TSidebarItem[];
      icon: ReactNode;
    }
  | undefined;

export type TUserPath = {
  name?: string;
  path?: string;
  icon?: ReactNode;
  element?: ReactNode;
  children?: TUserPath[];
};
