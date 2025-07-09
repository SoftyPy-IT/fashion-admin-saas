import { ConfigProvider } from "antd";
import frFR from "antd/locale/en_US";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import "./index.css";
import { persistor, store } from "./redux/store.ts";
import router from "./routes/router.tsx";

// Define color palette based on primary color #015487
const colors = {
  primary: "#015487",
  primaryHover: "#01436C",
  primaryActive: "#013351",
  primaryLight: "#E6F0F7",
  secondary: "#2D3748",
  success: "#0E9F6E",
  warning: "#FF8A4C",
  error: "#F04438",
  border: "#E2E8F0",
  background: "#F8FAFC",
  tableHeader: "#F1F5F9",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  white: "#FFFFFF",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={frFR}
      theme={{
        token: {
          // Base Theme Tokens
          colorPrimary: colors.primary,
          colorInfo: colors.primary,
          colorSuccess: colors.success,
          colorWarning: colors.warning,
          colorError: colors.error,
          colorTextBase: colors.textPrimary,
          colorBgBase: colors.white,
          fontFamily: "Inter, sans-serif",
          borderRadius: 6,
          wireframe: false,

          // Typography
          fontSize: 14,
          fontWeightStrong: 600,

          // Border
          colorBorder: colors.border,
          borderRadiusLG: 8,
          borderRadiusSM: 4,

          // Background
          colorBgContainer: colors.white,
          colorBgElevated: colors.white,
          colorBgLayout: colors.background,

          // Shadow
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          boxShadowSecondary: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
        components: {
          Button: {
            borderRadius: 6,
            controlHeight: 38,
            paddingContentHorizontal: 16,
            primaryColor: colors.white,
            defaultBg: colors.white,
            defaultBorderColor: colors.border,
            defaultColor: colors.textPrimary,
            fontWeight: 500,
          },
          Input: {
            controlHeight: 38,
            colorBorder: colors.border,
            activeBorderColor: colors.primary,
            hoverBorderColor: colors.primary,
            paddingInline: 12,
          },
          Select: {
            controlHeight: 38,
            colorBorder: colors.border,
            optionSelectedBg: colors.primaryLight,
          },
          Table: {
            borderColor: colors.border,
            headerBg: colors.tableHeader,
            headerColor: colors.textPrimary,
            headerSplitColor: colors.border,
            headerSortHoverBg: colors.primaryLight,
            headerSortActiveBg: colors.primaryLight,
            rowHoverBg: colors.background,
            rowSelectedBg: colors.primaryLight,
            paddingContentVerticalLG: 16,
            fontWeightStrong: 600,
          },
          Card: {
            colorBorder: colors.border,
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            paddingLG: 24,
          },
          Menu: {
            itemSelectedBg: colors.primaryLight,
            itemSelectedColor: colors.primary,
            itemHoverBg: colors.background,
            itemHoverColor: colors.primary,
          },
          Layout: {
            colorBgHeader: colors.white,
            colorBgBody: colors.background,
            colorBgTrigger: colors.white,
            siderBg: colors.white,
          },
          Modal: {
            paddingContentHorizontalLG: 24,
            paddingMD: 24,
            borderRadiusLG: 8,
          },
          Drawer: {
            paddingLG: 24,
          },
          Message: {
            borderRadius: 6,
          },
          Notification: {
            borderRadius: 6,
            paddingContentHorizontalLG: 16,
          },
          Tabs: {
            cardBg: colors.white,
            itemSelectedColor: colors.primary,
            itemHoverColor: colors.primary,
          },
          Form: {
            labelColor: colors.textSecondary,
            colorError: colors.error,
          },
          Radio: {
            buttonBg: colors.white,
            buttonCheckedBg: colors.primary,
          },
          Checkbox: {
            borderRadius: 4,
          },
          DatePicker: {
            controlHeight: 38,
            colorBorder: colors.border,
            cellActiveWithRangeBg: colors.primaryLight,
            cellHoverBg: colors.background,
          },
          Timeline: {
            tailColor: colors.border,
          },
          Segmented: {
            itemSelectedBg: colors.white,
            itemSelectedColor: colors.primary,
          },
        },
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
        <Toaster
          theme="light"
          toastOptions={{
            className: "my-toast",
            style: {
              background: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              padding: "16px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            },
          }}
          position="top-right"
          expand={true}
          richColors
        />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);
