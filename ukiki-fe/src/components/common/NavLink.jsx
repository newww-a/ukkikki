import { NavLink as RouterNavLink } from 'react-router-dom';

const NavLink = ({ to, children, className = '', ...rest }) => {
  return (
    <RouterNavLink
      to={to}
      {...rest}
      className={({ isActive }) =>
        `${className} flex items-center justify-center transition px-2 py-1 rounded-md text-center 
        ${
          isActive
            ? 'text-yellow hover:bg-gray-50'
            : 'text-gray-600 hover:bg-gray-50'
        }
        `
      }
    >
      {children}
    </RouterNavLink>
  );
};

export default NavLink;
