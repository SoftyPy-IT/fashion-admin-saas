import Container from "../../ui/Container";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateProfileForm from "./UpdateProfileForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Setting", href: "/dashboard/setting", current: true },
];

const Setting = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Setting"
      pageHeadingHref="/dashboard/profile"
      pageHeadingButtonText="Go to Profile"
    >
      <>
        <div className="">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Update your profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
          <div>
            <div className="flex pt-6 mt-4 border-t border-gray-100"></div>
          </div>
          <UpdateProfileForm />
        </div>
        <div className="mt-10">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Change your password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Ensure your account is using a long, random password to stay
              secure.
            </p>
          </div>
          <div>
            <div className="flex pt-6 mt-4 border-t border-gray-100"></div>
          </div>
          <ChangePasswordForm />
        </div>
      </>
    </Container>
  );
};

export default Setting;
