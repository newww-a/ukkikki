import { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import { publicRequest } from '../../../api/customAxios';
import useAuthStore from '../../../store/authStore';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuthStore(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint =
          userRole === 'company'
            ? '/api/v1/companies/profile'
            : '/api/v1/members/profile';
        const response = await publicRequest.get(endpoint, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.data) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('프로필 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>프로필 정보를 가져오지 못했습니다.</div>;
  }

  return (
    <section className="max-w-4xl mx-auto px-20 pt-2 flex flex-col items-center space-y-12">
      {/* 상단 아바타 영역 */}
      <ProfileAvatar profileImageUrl={user.profileImageUrl} />
      {/* 사용자 상세 정보 */}
      <ProfileInfo user={user} />
    </section>
  );
};

export default UserProfile;
