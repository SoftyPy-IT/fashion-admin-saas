import { useState, useRef, useEffect } from "react";
import { MdMenu, MdSearch } from "react-icons/md";
import { FaBell, FaUser, FaCog, FaSignOutAlt, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { logout, selectProfile } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

interface Props {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const sidebarRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectProfile);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="sticky top-0 left-0 z-30 flex items-center px-6 py-2 bg-white shadow-md shadow-black/5">
        <button
          onClick={toggleSidebar}
          type="button"
          ref={sidebarRef}
          name="sidebar"
          className="block text-lg text-gray-600 bg-white  "
        >
          <MdMenu className="cursor-pointer text-2xl text-gray-600 hover:text-gray-800" />
        </button>

        <ul className="flex items-center ml-auto">
          <li className="mr-1 ">
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 text-gray-400 bg-white rounded dropdown-toggle hover:bg-gray-50 hover:text-gray-600"
            >
              <MdSearch />
            </button>
            {/* Search Dropdown */}
            <div className="z-30 hidden w-full max-w-xs bg-white border border-gray-100 rounded-md shadow-md dropdown-menu shadow-black/5">
              {/* Your search dropdown content */}
            </div>
          </li>
          <li className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              role="button"
              className="flex items-center justify-center w-8 h-8 text-gray-400 bg-white rounded dropdown-toggle hover:bg-gray-50 hover:text-gray-600"
            >
              <FaBell />
            </button>
          </li>
          <li className="relative ml-3" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center bg-white"
              onClick={toggleDropdown}
            >
              <img
                src={
                  user?.avatar?.url ||
                  `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&color=7F9CF5&background=EBF4FF`
                }
                alt=""
                className="block object-cover w-8 h-8 align-middle rounded"
              />
            </button>
            {/* User Dropdown */}
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 shadow-md z-30 py-1.5 rounded-md bg-white border border-gray-100 w-40">
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-500 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    <FaHome className="inline-block mr-2" /> Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-500 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    <FaUser className="inline-block mr-2" /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-500 hover:bg-gray-100"
                    onClick={closeDropdown}
                  >
                    <FaCog className="inline-block mr-2" /> Settings
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-red-600 bg-white rounded hover:text-red-800 hover:bg-red-50"
                    onClick={() => dispatch(logout())}
                  >
                    <FaSignOutAlt className="inline-block mr-2" /> Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
