export type TagType =
  | "categories"
  | "brands"
  | "products"
  | "attributes"
  | "barcode"
  | "gallery-images"
  | "gallery-folder"
  | "storefront"
  | "offers"
  | "units"
  | "tax"
  | "suppliers"
  | "sections"
  | "coupons"
  | "orders"
  | "quantity-adjustments"
  | "stocks"
  | "billers"
  | "customers"
  | "quotations"
  | "purchases"
  | "expense-categories"
  | "expenses"
  | "users"
  | "BackupLogs"
  | "combos"
  | "blogs";

export enum TAG_TYPES {
  CATEGORIES = "categories",
  BRANDS = "brands",
  PRODUCTS = "products",
  ATTRIBUTES = "attributes",
  BARCODE = "barcode",
  GALLERY_IMAGES = "gallery-images",
  GALLERY_FOLDER = "gallery-folder",
  STOREFRONT = "storefront",
  OFFERS = "offers",
  UNITS = "units",
  TAXES = "tax",
  SUPPLIERS = "suppliers",
  SECTIONS = "sections",
  COUPONS = "coupons",
  ORDERS = "orders",
  QUANTITY_ADJUSTMENTS = "quantity-adjustments",
  STOCKS = "stocks",
  BILLERS = "billers",
  CUSTOMERS = "customers",
  QUOTATIONS = "quotations",
  PURCHASES = "purchases",
  EXPENSE_CATEGORIES = "expense-categories",
  EXPENSES = "expenses",
  USERS = "users",
  BackupLogs = "BackupLogs",
  COMBOS = "combos",
}

export const tagTypesArray: TagType[] = Object.values(TAG_TYPES) as TagType[];
