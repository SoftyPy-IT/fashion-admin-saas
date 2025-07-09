import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import PageHeading from "../components/PageHeading";

interface Page {
  name: string;
  href: string;
  current: boolean;
}

interface ContainerProps {
  pages: Page[];
  pageTitle: string;
  pageHeadingHref: string;
  pageHeadingButtonText: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  pages,
  pageTitle,
  pageHeadingHref,
  pageHeadingButtonText,
  children,
}) => {
  return (
    <>
      <Breadcrumb pages={pages} />
      <div className="px-4 py-10 mx-auto bg-white sm:px-6 lg:px-8">
        <PageHeading
          title={pageTitle}
          href={pageHeadingHref}
          buttonText={pageHeadingButtonText}
        />
        {children}
      </div>
    </>
  );
};

export default Container;
