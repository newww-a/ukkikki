
import { FaEnvelope } from 'react-icons/fa';
import { SiKakaotalk, SiGoogle } from 'react-icons/si';
import useAuthStore from '../../../store/authStore';

const ProfileInfo = ({ user }) => {
  const { userRole } = useAuthStore();

  const details =
    userRole === 'company'
      ? [
          { label: '회사명', value: user.companyName },
          { label: '대표자명', value: user.ceoName },
          { label: '이메일', value: user.email },
          { label: '사업자등록번호', value: user.businessRegistrationNumber },
          { label: '전화번호', value: user.phoneNumber },
        ]
      : [
          { label: '이름', value: user.name },
          { label: '이메일', value: user.email },
          {
            label: '소셜계정',
            value: user.provider,
            icon:
              !user.provider || user.provider === '' ? (
                <FaEnvelope className="mr-2 text-xl" />
              ) : user.provider.toLowerCase() === 'kakao' ? (
                <SiKakaotalk className="mr-2 text-xl text-yellow" />
              ) : user.provider.toLowerCase() === 'google' ? (
                <SiGoogle className="mr-2 text-xl" />
              ) : (
                <FaEnvelope className="mr-2 text-xl" />
              ),
          },
        ];

  return (
    <div className="w-full max-w-sm mx-auto">
      {details.map((detail) => (
        <div key={detail.label} className="flex justify-between mb-10">
          <div
            className={`flex-none font-semibold text-gray-700 ${
              userRole === 'company' ? 'w-32' : 'w-24'
            }`}
          >
            {detail.label}
          </div>
          <div
            className="text-gray-500 flex items-center"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
          >
            {detail.icon && detail.icon}
            <span>{detail.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileInfo;
