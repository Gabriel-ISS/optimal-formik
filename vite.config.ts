import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "optimal-formik",
      fileName: (format) => `optimal-formik.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      pathsToAliases: true,
      insertTypesEntry: true,
      outDir: "dist/types",
    }),
  ],
});
