import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트

const SidebarItem = ({ icon, label, to, active, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <li className="w-full">
      {/* a 태그 대신 Link 컴포넌트를 사용 */}
      <Link
        to={to || '#'} 
        onClick={handleClick}
        className={`flex w-full items-center px-4 py-2 rounded-md transition-colors text-lg 
          ${
            active
              ? 'bg-gray-100 font-semibold text-[#FFCF0E]'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;
