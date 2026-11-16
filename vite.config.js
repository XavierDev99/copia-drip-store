import { defineConfig } from 'vite';
import products from './api/products.js';

function registerCatalog(server) {
  server.middlewares.use('/api/products', products);
}

export default defineConfig({
  plugins: [{
    name: 'drip-store-catalog',
    configureServer: registerCatalog,
    configurePreviewServer: registerCatalog,
  }],
});
