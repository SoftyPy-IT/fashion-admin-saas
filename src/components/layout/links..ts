import {
  CiBookmark,
  CiCircleList,
  CiDatabase,
  CiFileOff,
  CiHome,
  CiSettings,
  CiShop,
  CiShoppingCart,
} from "react-icons/ci";
import { PiUsers } from "react-icons/pi";

import { FaBarcode } from "react-icons/fa";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: CiHome,
    path: "/dashboard",
    sublinks: [],
  },
  {
    title: "Products",
    icon: FaBarcode,
    path: "/products",
    sublinks: [
      { title: "List Products", path: "/dashboard/products/manage" },
      { title: "List Folders", path: "/dashboard/products/folders" },
      { title: "Add Product", path: "/dashboard/products/add" },
      {
        title: "List Combo",
        path: "/dashboard/products/combo",
      },

      {
        title: "Attributes",
        path: "/dashboard/products/attributes",
      },
      // {
      //   title: "Units",
      //   path: "/dashboard/products/units",
      // },
      { title: "Main Menu", path: "/dashboard/products/main-menu" },
      { title: "Categories", path: "/dashboard/products/categories" },
      { title: "Sub Categories", path: "/dashboard/products/sub-categories" },
      { title: "Home Menus", path: "/dashboard/products/menu" },
      { title: "Brands", path: "/dashboard/products/brands" },
      // { title: "Barcodes", path: "/dashboard/products/barcodes" },
    ],
  },
  {
    title: "Inventory",
    icon: CiCircleList,
    sublinks: [
      {
        title: "Quantity Adjustments",
        path: "/dashboard/inventory/quanity-adjustment",
      },
      {
        title: "Add Adjustment",
        path: "/dashboard/inventory/add-adjustment",
      },
      // {
      //   title: "Manage Stock",
      //   path: "/dashboard/inventory/manage-stock",
      // },
      // {
      //   title: "Count Stock",
      //   path: "/dashboard/inventory/count-stock",
      // },
    ],
  },
  {
    title: "Orders",
    icon: CiShoppingCart,
    path: "/orders",
    sublinks: [
      { title: "List Orders", path: "/dashboard/orders/manage" },
      { title: "Track Order", path: "/dashboard/orders/track" },
    ],
  },

  {
    title: "Quotations",
    icon: CiFileOff,
    path: "/quotations",
    sublinks: [
      { title: "List Quotations", path: "/dashboard/quotations/manage" },
      { title: "Add Quotation", path: "/dashboard/quotations/new" },
    ],
  },
  {
    title: "Purchases",
    icon: CiBookmark,
    path: "/purchases",
    sublinks: [
      { title: "List Purchases", path: "/dashboard/purchases/manage" },
      { title: "Add Purchase", path: "/dashboard/purchases/new" },
      {
        title: "List Expenses",
        path: "/dashboard/purchases/expenses/manage",
      },
      {
        title: "Add Expense",
        path: "/dashboard/purchases/expenses/new",
      },
      {
        title: "Expense Categories",
        path: "/dashboard/purchases/expense-categories",
      },
    ],
  },

  {
    title: "Peoples",
    icon: PiUsers,
    path: "/people",
    sublinks: [
      {
        title: "List Users",
        path: "/dashboard/people/users",
      },
      // {
      //   title: "List Billers",
      //   path: "/dashboard/people/billers",
      // },
      {
        title: "List Suppliers",
        path: "/dashboard/people/suppliers",
      },

      {
        title: "List Customers",
        path: "/dashboard/people/customers",
      },
    ],
  },
  {
    title: "Storefront",
    icon: CiShop,
    path: "/branches",
    sublinks: [
      { title: "Manage Storefront", path: "/dashboard/storefront/manage" },
      {
        title: "Featured products",
        path: "/dashboard/storefront/featured-products",
      },
      {
        title: "Deals and Offers",
        path: "/dashboard/storefront/deals-offers",
      },
      {
        title: "Manage Sections",
        path: "/dashboard/storefront/sections",
      },
    ],
  },
  {
    title: "News & Blog",
    icon: CiCircleList,
    sublinks: [
      { title: "List Blogs", path: "/dashboard/blogs/manage" },
      { title: "Add Blog", path: "/dashboard/blogs/new" },
    ],
  },
  {
    title: "Gallery ",
    icon: CiSettings,
    path: "/settings",
    sublinks: [
      { title: "Gallery Images", path: "/dashboard/settings/images" },
      { title: "Gallery Folders", path: "/dashboard/settings/gallery" },
      // { title: "Tax Rates", path: "/dashboard/settings/tax" },
    ],
  },
  {
    title: "Coupons",
    icon: CiHome,
    path: "/dashboard/coupons",
    sublinks: [],
  },
  {
    title: "Database",
    icon: CiDatabase,
    sublinks: [
      { title: "Activity Logs", path: "/dashboard/logs/activity" },
      { title: "Backup Logs", path: "/dashboard/logs/backup" },
    ],
  },
];

export default sidebarLinks;
