import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../../api/customAxios';
import useAuthStore from '../../store/authStore';
import Swal from 'sweetalert2';

const LoginForm = ({ isCompany }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginEndpoint = isCompany
        ? '/api/v1/auth/companies/login'
        : '/api/v1/auth/members/login';

      const response = await publicRequest.post(loginEndpoint, {
        email,
        password,
      });

      if (response.status === 200) {
        useAuthStore.getState().setUser(true, isCompany ? 'company' : 'member');
        // 기업 로그인 성공 시 /proposal, 일반 회원 로그인 성공 시 /
        navigate(isCompany ? '/proposal' : '/');
      } else {
        setErrorMessage('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage(error.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {errorMessage && (
        <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
      )}
      <div className="mb-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-4 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-4 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 text-white bg-brown rounded-xl"
      >
        {isCompany ? '기업 로그인' : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;
