import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const backendURL = env.VITE_API_PROD_BACKEND;
  const frontendURL = env.VITE_API_LOCAL_FRONTEND;


  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    resolve: {
      alias: {
        url: 'node:url',
      },
    },
    server: {
      allowedHosts: [backendURL, frontendURL],
      port: 5173,
      open: true,
      host: true,
    },

    preview: {
      host:true,
      port: 4173,
    }
  });
};
