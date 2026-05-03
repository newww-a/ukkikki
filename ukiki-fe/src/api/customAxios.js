import axios from 'axios';
import { useLoadingStore } from '../store/loadingStore';

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// axios 인스턴스 생성
export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 요청 시작 시 로딩 상태를 true로 변경
publicRequest.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().setLoading(true);
    return config;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 응답 성공 및 에러 발생 시 로딩 상태를 false로 변경
publicRequest.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 및 재시도하지 않은 요청인 경우 (에러 코드 'A003' 확인)
    if (
      error.response?.data?.error?.code === 'A003' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 재시도 방지

      try {
        // 토큰 갱신 요청 (기본 axios 사용)
        await axios.post(
          `${BASE_URL}/api/v1/auth/token/refresh`,
          {},
          { withCredentials: true },
        );

        // 새 토큰을 헤더에 적용하는 경우 (예시)
        // originalRequest.headers['Authorization'] = `Bearer ${data.newAccessToken}`;

        // 기존 요청 재시도: 명시적으로 request 메서드를 사용
        return publicRequest.request(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        useLoadingStore.getState().setLoading(false);
        return Promise.reject(refreshError);
      }
    }

    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  },
);
