import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import sidebarLinks from "./links.";
import { motion } from "framer-motion";

type Props = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: Props) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [activeSublink, setActiveSublink] = useState<string | null>(null);

  useEffect(() => {
    const pathname = location.pathname;
    const matchedLinkIndex = sidebarLinks.findIndex((link) => {
      if (
        link.path === pathname ||
        link.sublinks.some((sublink) => sublink.path === pathname)
      )
        return true;
      return false;
    });
    setActiveLink(matchedLinkIndex);

    const matchedSublink = sidebarLinks
      .flatMap((link) => link.sublinks || [])
      .find((sublink) => pathname.startsWith(sublink.path));
    setActiveSublink(matchedSublink ? matchedSublink.path : null);
  }, [location.pathname]);

  const toggleSublinks = (index: number) => {
    setActiveLink(activeLink === index ? null : index);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 z-50 w-64 h-full p-4 bg-gray-900 md:overflow-y-auto md:shadow-lg transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={{ x: 0 }}
        animate={isSidebarOpen ? { x: 0 } : { x: "-100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="flex items-center pb-4 border-b border-b-gray-800">
          <img
            src="https://placehold.co/32x32"
            alt="Logo"
            className="object-cover w-8 h-8 rounded"
          />
          <span className="ml-3 text-lg font-bold text-white">Logo</span>
        </div>
        <ul className="mt-4">
          {sidebarLinks.map((link, index) => {
            const isActive =
              activeLink === index ||
              link.sublinks.some((sublink) => sublink.path === activeSublink);
            return (
              <li key={index} className="mb-1 group">
                {link.sublinks.length > 0 ? (
                  <>
                    <div
                      className={`flex cursor-pointer items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md ${
                        isActive ? "bg-gray-800 text-white" : ""
                      }`}
                      onClick={() => toggleSublinks(index)}
                    >
                      <link.icon className="mr-3 text-lg" />
                      <span className="text-lg">{link.title}</span>
                      <MdOutlineKeyboardArrowRight
                        className={`ml-auto ${
                          isActive ? "transform rotate-90" : ""
                        }`}
                      />
                    </div>
                    <motion.ul
                      className={`pl-7 overflow-hidden ${
                        isActive ? "h-auto" : "h-0"
                      }`}
                      initial="collapsed"
                      animate={isActive ? "open" : "collapsed"}
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {link.sublinks.map((sublink, subIndex: number) => (
                        <motion.li
                          key={subIndex}
                          className={`my-4 ${
                            activeSublink === sublink.path
                              ? "text-blue-400"
                              : "text-gray-300"
                          }`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to={sublink.path}
                            onClick={() => setActiveLink(index)}
                            className="text-sm flex items-center hover:text-gray-100 before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3"
                          >
                            {sublink.title}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </>
                ) : (
                  <Link
                    to={link.path || "#"}
                    className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md ${
                      isActive ? "bg-gray-800 text-white" : ""
                    }`}
                    onClick={() => setActiveLink(index)}
                  >
                    <link.icon className="mr-3 text-lg" />
                    <span className="text-lg">{link.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
      {isSidebarOpen && (
        <motion.div
          className="fixed top-0 left-0 z-40 w-full h-full bg-black/50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeSidebar}
        ></motion.div>
      )}
    </>
  );
};

export default Sidebar;
