import AllEmployee from "../pages/Employees/AllEmployee";
import CreateEmployee from "../pages/Employees/CreateEmployee";

import AddProduct from "../pages/Products/AddProduct/AddProduct";
import ManageProducts from "../pages/Products/ManageProducts/ManageProducts";
import Profile from "../pages/Profile/Profile";
import ManageBrands from "../pages/Products/Brands/ManageBrands";
import ManageQuotations from "../pages/Quotations/Manage/ManageQuotations";
import CreateQuotation from "../pages/Quotations/New/CreateQuotation";
import ManageAccount from "../pages/Accounts/Account/ManageAccount";
import ManageTransaction from "../pages/Accounts/Transaction/ManageTransaction";
import EmployeeProfile from "../pages/Employees/EmployeeProfile";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManageCategories from "../pages/Products/Categories/ManageCategories";

import {
  RiHome2Line,
  RiSettings2Line,
  RiUserShared2Fill,
  RiShoppingBasketFill,
  RiFileCopy2Fill,
} from "react-icons/ri";
import Setting from "../pages/Profile/Setting";
import ManageBarcodes from "../pages/Products/Barcode/ManageBarcodes";
import ProductDetails from "../pages/Products/ManageProducts/ProductDetails";
import ManageGallery from "../pages/Settings/Gallery/ManageGallery";
import GalleryImages from "../pages/Settings/Gallery/GalleryImages";
import ManageStorefront from "../pages/Storefront/Setup/ManageStorefront";
import EditStorefront from "../pages/Storefront/Setup/EditStorefront";
import ManageFeaturedProducts from "../pages/Storefront/FeaturedProducts/ManageFeaturedProducts";
import ManageOffers from "../pages/Storefront/Offers/ManageOffers";
import OfferDetails from "../pages/Storefront/Offers/OfferDetails";
import Images from "../pages/Settings/Gallery/Images";
import ManageAttributes from "../pages/Products/Attributes/ManageAttributes";
import ManageUnits from "../pages/Products/Unit/ManageUnits";
import ManageTax from "../pages/Settings/Tax/ManageTax";
import ManageSuppliers from "../pages/People/Suppliers/ManageSuppliers";
import UpdateProduct from "../pages/Products/ManageProducts/UpdateProduct";
import ManageSection from "../pages/Storefront/Sections/ManageSection";
import SectionDetails from "../pages/Storefront/Sections/SectionDetails";
import AddSliderForm from "../pages/Storefront/Setup/AddSliderForm";
import ManageCoupon from "../pages/Settings/Coupon/ManageCoupon";
import ManageOrders from "../pages/Orders/ManageOrders";
import OrderDetails from "../pages/Orders/OrderDetails";
import TrackOrder from "../pages/Orders/TrackOrder";
import { MdInventory } from "react-icons/md";
import ManageQuantityAdjustment from "../pages/Inventory/QuantityAdjustmetn/ManageQuantityAdjustment";
import AddAdjustment from "../pages/Inventory/QuantityAdjustmetn/AddAdjustment";
import ManageStock from "../pages/Inventory/Stock/ManageStock";
import CountStock from "../pages/Inventory/Stock/CountStock";
import FinalizeCount from "../pages/Inventory/Stock/FinalizeCount";
import ViewCount from "../pages/Inventory/Stock/ViewCount";
import ManageBillers from "../pages/People/Billers/ManageBillers";
import ManageCustomers from "../pages/People/Customers/ManageCustomers";
import QuotationsDetails from "../pages/Quotations/Manage/QuotationsDetails";
import ManagePurchase from "../pages/Purchase/ManagePurchase";
import AddPurchase from "../pages/Purchase/AddPurchase";
import PurchaseDetails from "../pages/Purchase/PurchaseDetails";
import { BiPurchaseTag } from "react-icons/bi";
import ManageExpenseCategory from "../pages/Purchase/ExpenseCategory/ManageExpenseCategory";
import ExpenseCategoryDetails from "../pages/Purchase/ExpenseCategory/ExpenseCategoryDetails";
import ManageExpenses from "../pages/Purchase/Expense/ManageExpenses";
import AddExpense from "../pages/Purchase/Expense/AddExpense";
import ManageUsers from "../pages/People/Users/ManageUsers";
import ManageLogs from "../pages/BackupAndLogs/ManageLogs/ManageLogs";
import ManageBackup from "../pages/BackupAndLogs/ManageBackup/ManageBackup";
import ManageCombo from "../pages/Products/Combo/ManageCombo";
import ProductsFolders from "../pages/Products/Folders/ProductsFolders";
import FolderDetails from "../pages/Products/Folders/FolderDetails";
import Menu from "../pages/Products/Categories/Menu";
import ManageMainMenu from "../pages/Products/Categories/ManageMainMenu";
import ManageSubcategories from "../pages/Products/Categories/ManageSubcategories";
import ManageNews from "../pages/News/ManageNews";
import AddNews from "../pages/News/AddNews";
import UpdateNews from "../pages/News/UpdateNews";

export const AdminRoutes = [
  {
    name: "Dashboard",
    icon: <RiHome2Line />,
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    name: "Coupons",
    icon: <RiHome2Line />,
    path: "/dashboard/coupons",
    element: <ManageCoupon />,
  },
  {
    name: "Profile",
    icon: <RiUserShared2Fill />,
    children: [
      {
        name: "Profile",
        path: "profile",
        element: <Profile />,
      },
      {
        name: "Settings",
        path: "settings",
        element: <Setting />,
      },
    ],
  },

  {
    name: "Products",
    icon: <RiShoppingBasketFill />,
    children: [
      {
        name: "Manage Products",
        path: "products/manage",
        element: <ManageProducts />,
      },
      {
        name: "Manage Products",
        path: "products/manage/:id",
        element: <ProductDetails />,
      },
      {
        name: "List Folders",
        path: "products/folders",
        element: <ProductsFolders />,
      },
      {
        name: "Add Products In Folder",
        path: "products/folders/:id",
        element: <FolderDetails />,
      },
      {
        name: "Add Product",
        path: "products/add",
        element: <AddProduct />,
      },
      {
        name: "List Combo",
        path: "products/combo",
        element: <ManageCombo />,
      },

      {
        name: "Update Product",
        path: "products/manage/update/:id",
        element: <UpdateProduct />,
      },
      {
        name: "Product Attributes",
        path: "products/attributes",
        element: <ManageAttributes />,
      },
      {
        name: "Units",
        path: "products/units",
        element: <ManageUnits />,
      },
      {
        name: "Main Menu",
        path: "products/main-menu",
        element: <ManageMainMenu />,
      },
      {
        name: "Categories",
        path: "products/categories",
        element: <ManageCategories />,
      },
      {
        name: "Sub Categories",
        path: "products/sub-categories",
        element: <ManageSubcategories />,
      },
      {
        name: "Serialize Menu",
        path: "products/menu",
        element: <Menu />,
      },
      {
        name: "Manage Brands",
        path: "products/brands",
        element: <ManageBrands />,
      },
      {
        name: "Manage Barcodes",
        path: "products/barcodes",
        element: <ManageBarcodes />,
      },
    ],
  },
  {
    name: "Inventory",
    icon: <MdInventory />,
    children: [
      {
        name: "Quanity Adjustment",
        path: "inventory/quanity-adjustment",
        element: <ManageQuantityAdjustment />,
      },
      {
        name: "Add Adjustment",
        path: "inventory/add-adjustment",
        element: <AddAdjustment />,
      },
      {
        name: "Manage Stock",
        path: "inventory/manage-stock",
        element: <ManageStock />,
      },
      {
        name: "Count Stock",
        path: "inventory/count-stock",
        element: <CountStock />,
      },
      {
        name: "Finalize Count",
        path: "inventory/manage-stock/finalize-count/:id",
        element: <FinalizeCount />,
      },
      {
        name: "View Count",
        path: "inventory/manage-stock/view-count/:id",
        element: <ViewCount />,
      },
    ],
  },

  {
    name: "Accounts",
    children: [
      {
        name: "Manage Accounts",
        path: "accounts/manage",
        element: <ManageAccount />,
      },
      {
        name: "Manage Transactions",
        path: "accounts/transaction",
        element: <ManageTransaction />,
      },
      {
        name: "Details",
        path: "accounts/manage/:id",
        element: <PurchaseDetails />,
      },
    ],
  },
  {
    name: "Quotations",
    icon: <RiFileCopy2Fill />,
    children: [
      {
        name: "Manage Quotations",
        path: "quotations/manage",
        element: <ManageQuotations />,
      },
      {
        name: "Create Quotation",
        path: "quotations/new",
        element: <CreateQuotation />,
      },
      {
        name: "Quotation Details",
        path: "quotations/manage/:id",
        element: <QuotationsDetails />,
      },
    ],
  },
  {
    name: "Purchase",
    icon: <BiPurchaseTag />,
    children: [
      {
        name: "Manage Purchase",
        path: "purchases/manage",
        element: <ManagePurchase />,
      },
      {
        name: "Create Purchase",
        path: "purchases/new",
        element: <AddPurchase />,
      },
      {
        name: "Purchase Details",
        path: "purchases/manage/:id",
        element: <PurchaseDetails />,
      },
      {
        name: "Expense Categories",
        path: "purchases/expense-categories",
        element: <ManageExpenseCategory />,
      },
      {
        name: "Expense Categories Details",
        path: "purchases/expense-categories/:id",
        element: <ExpenseCategoryDetails />,
      },
      {
        name: "List Expenses",
        path: "purchases/expenses/manage",
        element: <ManageExpenses />,
      },
      {
        name: "Add Expense",
        path: "purchases/expenses/new",
        element: <AddExpense />,
      },
    ],
  },
  {
    name: "Employees",
    icon: <RiUserShared2Fill />,
    children: [
      {
        name: "Manage Employees",
        path: "employees/manage",
        element: <AllEmployee />,
      },
      {
        name: "Create Employee",
        path: "employees/add",
        element: <CreateEmployee />,
      },
      {
        name: "Employee Profile",
        path: "employees/manage/:id",
        element: <EmployeeProfile />,
      },
    ],
  },
  {
    name: "Orders",
    icon: <RiUserShared2Fill />,
    children: [
      {
        name: "Manage Orders",
        path: "orders/manage",
        element: <ManageOrders />,
      },
      {
        name: "Manage Orders",
        path: "orders/manage/:id",
        element: <OrderDetails />,
      },
      {
        name: "Track Orders",
        path: "orders/track",
        element: <TrackOrder />,
      },
    ],
  },
  {
    name: "People",
    icon: <RiUserShared2Fill />,
    children: [
      {
        name: "Suppliers",
        path: "people/suppliers",
        element: <ManageSuppliers />,
      },
      {
        name: "Billers",
        path: "people/billers",
        element: <ManageBillers />,
      },
      {
        name: "Customers",
        path: "people/customers",
        element: <ManageCustomers />,
      },
      {
        name: "Users",
        path: "people/users",
        element: <ManageUsers />,
      },
    ],
  },
  {
    name: "Storefront",
    icon: <RiUserShared2Fill />,
    children: [
      {
        name: "Manage Storefront",
        path: "storefront/manage",
        element: <ManageStorefront />,
      },
      {
        name: "Manage Storefront",
        path: "storefront/manage/edit/:id",
        element: <EditStorefront />,
      },
      {
        name: "Manage Storefront",
        path: "storefront/manage/add-slider/:id",
        element: <AddSliderForm />,
      },
      {
        name: "Featured Products",
        path: "storefront/featured-products",
        element: <ManageFeaturedProducts />,
      },
      {
        name: "Deals and Offers",
        path: "storefront/deals-offers",
        element: <ManageOffers />,
      },
      {
        name: "Deals and Offers",
        path: "storefront/deals-offers/manage/:id",
        element: <OfferDetails />,
      },
      {
        name: "Manage Sections",
        path: "storefront/sections",
        element: <ManageSection />,
      },
      {
        name: "Manage Sections",
        path: "storefront/sections/manage/:id",
        element: <SectionDetails />,
      },
    ],
  },
  {
    name: "News & Blog",
    icon: <RiUserShared2Fill />,
    children: [
      {
        name: "List Blogs",
        path: "blogs/manage",
        element: <ManageNews />,
      },
      {
        name: "Update Blog",
        path: "blogs/manage/update/:id",
        element: <UpdateNews />,
      },

      {
        name: "Add Blog",
        path: "blogs/new",
        element: <AddNews />,
      },
    ],
  },
  {
    name: "Settings",
    icon: <RiSettings2Line />,
    children: [
      {
        name: "Images",
        path: "settings/images",
        element: <Images />,
      },
      {
        name: "Gallery",
        path: "settings/gallery",
        element: <ManageGallery />,
      },
      {
        name: "Gallery Images",
        path: "settings/gallery/manage/:id",
        element: <GalleryImages />,
      },
      {
        name: "Tax",
        path: "settings/tax",
        element: <ManageTax />,
      },
    ],
  },
  {
    name: "Logs & Backup",
    icon: <RiSettings2Line />,
    children: [
      {
        name: "Logs",
        path: "logs/activity",
        element: <ManageLogs />,
      },
      {
        name: "Backup",
        path: "logs/backup",
        element: <ManageBackup />,
      },
    ],
  },
];
