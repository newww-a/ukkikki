import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { publicRequest } from '../../api/customAxios';
import Swal from 'sweetalert2';
import logo from '../../assets/logo.png';
import defaultProfile from '../../assets/profile.png';
import NavLink from '../common/NavLink';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, userRole, logout } = useAuthStore();
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    if (location.state?.activeButton === 'createGroup') {
      setActiveButton('createGroup');
    }
  }, [location.state]);

  // user 정보에 profileImageUrl이 없으면, userRole에 따라 API 호출
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 일반 사용자면 members, 여행사면 companies 엔드포인트 사용
        const endpoint =
          userRole === 'company'
            ? '/api/v1/companies/profile'
            : '/api/v1/members/profile';
        const response = await publicRequest.get(endpoint);
        if (response.status === 200 && response.data?.data?.profileImageUrl) {
          setProfileImage(response.data.data.profileImageUrl);
        }
      } catch (error) {
        console.error('프로필 정보 조회 실패:', error);
      }
    };

    if (user && !user.profileImageUrl) {
      fetchProfile();
    } else if (user?.profileImageUrl) {
      setProfileImage(user.profileImageUrl);
    }
  }, [user, userRole]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '로그아웃 하시겠습니까?',
      text: '로그아웃하면 다시 로그인해야 합니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await publicRequest.post(
        '/api/v1/auth/logout',
        {},
        { withCredentials: true },
      );
      if (response.status === 200) {
        console.log('✅ 로그아웃 성공:', response.data);
        useAuthStore.getState().logout();
        await useAuthStore.persist.clearStorage();
        navigate('/');
        Swal.fire({
          title: '로그아웃 되었습니다!',
          text: '메인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: '확인',
        });
      }
    } catch (error) {
      console.error('🚨 로그아웃 실패:', error);
      Swal.fire({
        title: '로그아웃 실패',
        text: '다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  const handleCreateRoomClick = () => {
    setActiveButton('createGroup');
    navigate('/', {
      state: { createGroup: true, activeButton: 'createGroup' },
    });
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white shadow-sm">
      <Link to="/">
        <img src={logo} alt="Logo" className="object-contain w-32 h-32 ml-10" />
      </Link>
      <nav className="flex items-center mr-10 space-x-6">
        {!user ? (
          <>
            <NavLink to="/about">서비스 소개</NavLink>
            <NavLink to="/login">회원가입 | 로그인</NavLink>
          </>
        ) : userRole === 'company' ? (
          <>
            <div className="items-center hidden space-x-6 md:flex">
              <NavLink to="/proposal">제안 관리</NavLink>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={profileImage}
                  alt="프로필"
                  className="w-10 h-10 border border-gray-300 rounded-full"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="md:hidden">
                    <NavLink
                      to="/proposal"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left !justify-start"
                      style={{ display: 'block', textAlign: 'left' }}
                    >
                      제안 관리
                    </NavLink>
                  </div>
                  <Link
                    to="/myprofile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="items-center hidden space-x-6 md:flex">
              <NavLink to="/search-room">전체여행방</NavLink>
              <NavLink to="/myroom">내여행방</NavLink>
              <button
                onClick={handleCreateRoomClick}
                className={`flex items-center justify-center transition px-2 py-1 rounded-md ${
                  activeButton === 'createGroup'
                    ? 'text-yellow'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                방만들기
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={profileImage}
                  alt="프로필"
                  className="w-10 h-10 border border-gray-300 rounded-full"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="md:hidden">
                    <Link
                      to="/search-room"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      전체여행방
                    </Link>
                    <Link
                      to="/myroom"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      내여행방
                    </Link>
                    <button
                      onClick={() => {
                        handleCreateRoomClick();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      방만들기
                    </button>
                  </div>
                  <Link
                    to="/myprofile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
