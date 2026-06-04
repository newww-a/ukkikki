import { useRef, useState } from 'react';
import { publicRequest } from '../../../api/customAxios';
import Swal from 'sweetalert2';
import useAuthStore from '../../../store/authStore';

const ProfileAvatar = ({ profileImageUrl }) => {
  const { userRole } = useAuthStore();
  const isCompany = userRole === 'company';
  const [imageUrl, setImageUrl] = useState(profileImageUrl);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const endpoint = isCompany
      ? '/api/v1/companies/profile/image'
      : '/api/v1/members/profile/image';

    try {
      const response = await publicRequest.put(endpoint, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Swal.fire({
          title: '업로드 성공',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: '확인',
        });
        const newUrl = response.data.data.profileImageUrl;
        setImageUrl(newUrl);
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      Swal.fire({
        title: '업로드 실패',
        text: '다시 시도해주세요.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      {/* 아바타 영역: 클릭하면 파일 선택창이 열림 */}
      <div
        onClick={handleAvatarClick}
        className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center mb-2 cursor-pointer shadow-lg"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <svg
            className="w-16 h-16 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.667 0 8 1.333 8 4v2H4v-2c0-2.667 5.333-4 8-4zm0-2c-1.06 0-2.08-.421-2.828-1.172C8.421 8.08 8 7.06 8 6s.421-2.08 1.172-2.828C9.92 2.421 10.94 2 12 2s2.08.421 2.828 1.172C15.579 3.92 16 4.94 16 6s-.421 2.08-1.172 2.828C14.08 9.579 13.06 10 12 10z" />
          </svg>
        )}
      </div>

      {/* 숨겨진 파일 input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default ProfileAvatar;
