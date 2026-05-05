import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//const keyPath = path.resolve(__dirname, 'colo-cms.gov.ph.key');
//const certPath = path.resolve(__dirname, 'colo-cms.gov.ph.crt');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    envPrefix: 'VITE_',
    server: {
    allowedHosts: ['localhost', '127.0.0.1', 'colo-cms.gov.ph'],
    //https: {
    //  key: fs.readFileSync(keyPath),
    //  cert: fs.readFileSync(certPath),
    //},
  },
})
