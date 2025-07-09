import { ReactNode } from "react";

// Define types for route and sidebar link
interface Route {
  name: string;
  icon?: ReactNode;
  path: string;
  element?: ReactNode;
  children?: Route[];
}

export interface TSidebarLink {
  title: string;
  icon?: ReactNode;
  path: string;
  activePath?: string;
  sublinks: {
    title: string;
    path: string;
    activePath: string;
  }[];
}

// Function to extract sidebar links from routes
const sidebarItemsGenerator = (routes: Route[]): TSidebarLink[] => {
  const sidebarLinks: TSidebarLink[] = [];

  routes.forEach((route) => {
    if (route.children) {
      const sublinks = route.children.map((child) => ({
        title: child.name,
        path: child.path,
        activePath: `${route.path}/${child.path}`,
      }));

      sidebarLinks.push({
        title: route.name,
        icon: route.icon,
        path: route.path,
        sublinks,
      });
    } else {
      sidebarLinks.push({
        title: route.name,
        icon: route.icon,
        path: route.path,
        activePath: `${route.path}`,
        sublinks: [],
      });
    }
  });

  return sidebarLinks;
};

export default sidebarItemsGenerator;
