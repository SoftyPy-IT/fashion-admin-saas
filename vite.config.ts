import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_API_URL": JSON.stringify(env.REACT_APP_API_URL),
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.MODE": JSON.stringify(env.MODE),
    },
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
    ],
  };
});
