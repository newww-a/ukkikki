import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    useAuthStore.getState().setUser(true, 'member');
    // 로그인 성공 시 바로 메인페이지로 이동
    navigate('/');
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그인 중입니다. 잠시만 기다려주세요...</p>
    </div>
  );
};

export default OAuthSuccessPage;
