import { Link } from "react-router-dom";

interface Props {
  title: string;
  href: string;
  buttonText?: string; // Making buttonText optional by adding '?'
}

const PageHeading = ({ title, href, buttonText }: Props) => {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold leading-7 text-gray-900 lg:text-2xl sm:truncate 2xl:text-3xl sm:tracking-tight">
          {title}
        </h2>
      </div>
      {buttonText && (
        <div className="flex mt-4 md:ml-4 md:mt-0">
          <Link to={href} className="btn_outline">
            {buttonText}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PageHeading;
