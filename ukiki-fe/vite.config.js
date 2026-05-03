import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // 서버 시작 시 브라우저 자동 열림
    proxy: {
      '/api/public': {
        target: 'http://openapi.airport.co.kr', // API의 base URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/api\/public/, '/service/rest/FlightScheduleList'),
      },
    },
    // host: 'openapi.airport.co.kr',

    // host: 'fe.i12c204.p.ssafy.io',
  },
  define: {
    global: 'globalThis',
  },
});
