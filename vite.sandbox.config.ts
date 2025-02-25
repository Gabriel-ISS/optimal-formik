import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // Establece la raíz en la carpeta sandbox
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/'), // Alias para tus componentes
    },
  },
  build: {
    outDir: 'dist-sandbox', // Salida de la build (opcional)
    emptyOutDir: true, // Vacía el directorio de salida antes de construir
  },
});
