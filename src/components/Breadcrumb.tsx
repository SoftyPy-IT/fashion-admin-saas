import { IoMdHome } from "react-icons/io";
import { Link } from "react-router-dom";

interface Page {
  name: string;
  href: string;
  current: boolean;
}

interface BreadcrumbProps {
  pages: Page[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pages }) => {
  return (
    <nav
      className="flex bg-white border-b border-gray-200"
      aria-label="Breadcrumb"
    >
      <ol
        role="list"
        className="flex w-full px-4 mx-auto space-x-4 sm:px-6 lg:px-8"
      >
        <li className="flex">
          <div className="flex items-center">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <IoMdHome className="flex-shrink-0 w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page, index) => (
          <li key={index} className="flex">
            <div className="flex items-center">
              {index !== 0 && (
                <svg
                  className="flex-shrink-0 w-6 h-full text-gray-200"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
              )}
              <Link
                to={page.href}
                className={`ml-4 text-sm font-medium ${
                  page.current
                    ? "text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
