
import { FaEnvelope } from 'react-icons/fa';

const SocialAccounts = () => {

  return (
    <div>
      <div className="justify-between flex items-center">
        <h3 className="font-bold text-gray-700">연결된 소셜계정</h3>
        <FaEnvelope className="mr-2 text-xl" />
      </div>
    </div>
  );
};

export default SocialAccounts;
