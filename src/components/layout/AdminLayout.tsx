import { Fragment, useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Dialog, Menu, Transition, Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import sidebarLinks from "./links.";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectProfile } from "../../redux/features/auth/authSlice";
import { useGetStorefrontDataQuery } from "../../redux/features/storefront/storefront.api";
import Preloader from "../Preloader";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const userNavigation = [
  { name: "Your Profile", href: "/dashboard/profile" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<null | string>(null);
  const location = useLocation();

  const { data: storefrontData, isLoading: storefrontLoading } =
    useGetStorefrontDataQuery(undefined) as any;

  useEffect(() => {
    if (storefrontData) {
      document.title = `${storefrontData.shopName} - Dashboard`;
    }
  }, [storefrontData]);

  useEffect(() => {
    const handleRouteChange = () => {
      const activeGroup = sidebarLinks.find((item) =>
        item.sublinks.some((sublink) =>
          location.pathname.startsWith(sublink.path)
        )
      );
      if (activeGroup) {
        setOpenGroup(activeGroup.title);
      } else {
        setOpenGroup(null);
      }
    };

    handleRouteChange(); // Run on initial mount
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto"; // Reset on cleanup
    };
  }, [sidebarOpen]);

  const handleGroupToggle = (groupName: string | null) => {
    setOpenGroup((prevGroup) => (prevGroup === groupName ? null : groupName));
  };

  const isActiveLink = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path);

  const isActiveGroup = (groupName: string | null) => openGroup === groupName;

  const activeLinkStyle = "bg-gray-900 ";
  const inactiveLinkStyle =
    "text-gray-300 bg-gray-950 hover:bg-gray-900 hover:text-white hover:bg-opacity-75";

  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  if (storefrontLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-gray-950">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                      <button
                        className="flex items-center justify-center w-10 h-10 ml-1 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex items-center flex-shrink-0 h-16 px-4 bg-gray-100">
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center w-full h-full"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <img
                          className="w-auto h-16"
                          src={
                            storefrontData?.logo || "https://i.pravatar.cc/150"
                          }
                          alt={storefrontData?.shopName || "Your Company"}
                        />
                      </div>
                    </Link>
                  </div>
                  <nav className="flex-1 px-2 mt-5 space-y-1 overflow-y-auto bg-gray-950 ">
                    <ul className="space-y-1">
                      {sidebarLinks.map((item) => (
                        <li key={item.title}>
                          {item.sublinks.length === 0 ? (
                            <Link
                              to={item.path || "#"}
                              className={classNames(
                                isActiveLink(item.path || "#")
                                  ? activeLinkStyle
                                  : inactiveLinkStyle,
                                "group flex items-center text-white px-2 py-2 text-sm font-medium rounded-md"
                              )}
                            >
                              <item.icon
                                className="w-6 h-6 mr-3 text-gray-400"
                                aria-hidden="true"
                              />
                              {item.title}
                            </Link>
                          ) : (
                            <Disclosure
                              as="div"
                              className="space-y-1"
                              key={item.title}
                              defaultOpen={isActiveGroup(item.title)}
                            >
                              {({ open }) => (
                                <>
                                  <Disclosure.Button
                                    onClick={() =>
                                      handleGroupToggle(item.title)
                                    }
                                    className={classNames(
                                      isActiveGroup(item.title)
                                        ? activeLinkStyle
                                        : inactiveLinkStyle,
                                      "group flex items-center w-full px-2 py-2 text-left text-sm text-white font-medium rounded-md focus:outline-none"
                                    )}
                                  >
                                    <item.icon
                                      className="w-6 h-6 mr-3 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span className="flex-1">{item.title}</span>
                                    <ChevronRightIcon
                                      className={classNames(
                                        open
                                          ? "rotate-90 text-gray-400"
                                          : "text-gray-400",
                                        "w-5 h-5 transition-transform"
                                      )}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="space-y-1">
                                    {item.sublinks.map((sublink) => (
                                      <Link
                                        key={sublink.path}
                                        to={sublink.path}
                                        className={classNames(
                                          isActiveLink(sublink.path)
                                            ? `${activeLinkStyle} text-blue-400`
                                            : inactiveLinkStyle,
                                          "group flex items-center pl-10 pr-2 py-2 text-sm font-medium rounded-md  focus:outline-none  bg-gray-950 hover:bg-gray-900  before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3 hover:text-blue-400"
                                        )}
                                      >
                                        {sublink.title}
                                      </Link>
                                    ))}
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pb-4 overflow-y-auto bg-gray-950">
              <div className="flex items-center flex-shrink-0 h-16 px-4 bg-gray-100">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center w-full h-full"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      className="w-auto h-16"
                      src={storefrontData?.logo || "https://i.pravatar.cc/150"}
                      alt={storefrontData?.shopName || "Your Company"}
                    />
                  </div>
                </Link>
              </div>

              <nav className="flex-1 px-2 mt-5 space-y-1 bg-gray-950">
                <ul className="space-y-3">
                  {sidebarLinks.map((item) => (
                    <li key={item.title}>
                      {item.sublinks.length === 0 ? (
                        <Link
                          to={item.path || "#"}
                          className={classNames(
                            isActiveLink(item.path || "#")
                              ? activeLinkStyle
                              : inactiveLinkStyle,
                            "group flex items-center text-gray-100 px-2 py-2 text-sm  rounded-md"
                          )}
                        >
                          <item.icon
                            className="w-5 h-5 mr-3 text-gray-100"
                            aria-hidden="true"
                          />
                          {item.title}
                        </Link>
                      ) : (
                        <Disclosure
                          as="div"
                          className="space-y-1"
                          key={item.title}
                          defaultOpen={isActiveGroup(item.title)}
                        >
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                onClick={() => handleGroupToggle(item.title)}
                                className={classNames(
                                  isActiveGroup(item.title)
                                    ? activeLinkStyle
                                    : inactiveLinkStyle,
                                  "group flex items-center w-full px-2 py-2 text-left text-sm text-gray-100 rounded-md focus:outline-none"
                                )}
                              >
                                <item.icon
                                  className="w-5 h-5 mr-3 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="flex-1">{item.title}</span>
                                <ChevronRightIcon
                                  className={classNames(
                                    open
                                      ? "rotate-90 text-gray-400"
                                      : "text-gray-400",
                                    "w-5 h-5 transition-transform"
                                  )}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="space-y-1">
                                {item.sublinks.map((sublink) => (
                                  <Link
                                    key={sublink.path}
                                    to={sublink.path}
                                    className={classNames(
                                      isActiveLink(sublink.path)
                                        ? `${activeLinkStyle} text-blue-400`
                                        : inactiveLinkStyle,
                                      "group flex items-center pl-10 pr-2 py-2 text-sm  rounded-md  focus:outline-none  bg-gray-950 hover:bg-gray-900  before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3 hover:text-blue-400"
                                    )}
                                  >
                                    {sublink.title}
                                  </Link>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <div className="relative z-10 flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-200 shadow bg-gray-950 sm:px-6 lg:px-8">
            <button
              className="px-4 text-gray-500 bg-white focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="flex justify-between flex-1 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-1"></div>
              <div className="flex items-center ml-4 md:ml-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex items-center max-w-xs bg-white rounded-full focus:outline-none ">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src={
                          profile?.avatar
                            ? profile?.avatar.url
                            : "https://i.pravatar.cc/150"
                        }
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              to={item.href}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => dispatch(logout())}
                            className={classNames(
                              "block w-full px-4 py-2  text-sm text-left rounded transition-colors duration-200", // Base styles
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-white bg-rose-600" // Active/inactive styles
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
