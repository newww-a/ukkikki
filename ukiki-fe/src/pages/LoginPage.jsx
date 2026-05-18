import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroText from '../components/common/SloganText';
import LoginForm from '../components/auth/LoginForm';
import useAuthStore from '../store/authStore';

import kakaoLogo from '../assets/icon.png';
import googleLogo from '../assets/google.png';
import logo from '../assets/logo.png';
import bgImage from '../assets/login-bg.png';

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [isCompany, setIsCompany] = useState(false);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
    >
      <Header />
      <main className="flex flex-col items-center flex-1 py-10 md:flex-row md:px-28">
        <HeroText textColor="text-brown" />

        <div className="flex items-center justify-center w-full md:w-1/2">
          <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
            <img src={logo} className="w-48 h-auto mx-auto my-6" alt="로고" />

            {/* 일반 유저 / 여행사 스위치 버튼 */}
            <div className="flex items-center justify-center mb-6">
              <span
                className={`text-sm font-semibold ${
                  !isCompany ? 'text-brown' : 'text-gray-400'
                }`}
              >
                일반 유저
              </span>
              <div
                className={`relative w-14 h-7 mx-4 bg-gray-300 rounded-full cursor-pointer ${
                  isCompany ? 'bg-brown' : 'bg-gray-300'
                }`}
                onClick={() => setIsCompany(!isCompany)}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    isCompany ? 'translate-x-7' : 'translate-x-0'
                  }`}
                ></div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  isCompany ? 'text-brown' : 'text-gray-400'
                }`}
              >
                여행사
              </span>
            </div>

            {/* 로그인 폼 */}
            <LoginForm isCompany={isCompany} />

            {/* ✅ 기업 로그인 시 소셜 로그인 버튼 숨김 */}
            {!isCompany && (
              <div className="mt-6 space-y-4">
                <button
                  className="relative flex items-center w-full py-3 text-black transition bg-white border border-gray-200 rounded-xl"
                  onClick={() =>
                    (window.location.href = `${baseUrl}api/v1/oauth2/authorization/google`)
                  }
                >
                  <img
                    src={googleLogo}
                    alt="Google"
                    className="absolute w-5 h-5 left-4"
                  />
                  <span className="flex-1 text-center">
                    구글 계정으로 로그인하기
                  </span>
                </button>
                <button
                  className="relative flex items-center w-full py-3 transition bg-yellow text-brown rounded-xl"
                  onClick={() =>
                    (window.location.href = `${baseUrl}api/v1/oauth2/authorization/kakao`)
                  }
                >
                  <img
                    src={kakaoLogo}
                    alt="Kakao"
                    className="absolute w-6 h-6 left-4"
                  />
                  <span className="flex-1 text-center">
                    카카오 계정으로 로그인하기
                  </span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center mt-4 space-x-2">
              <Link to="/signup" className="text-gray-600 hover:underline">
                이메일로 회원가입
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                to="/signup?type=company"
                className="text-blue-500 hover:underline"
              >
                기업으로 회원가입하기
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
