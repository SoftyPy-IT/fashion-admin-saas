import { Link } from "react-router-dom";
import image from "../../assets/notfound.json";
import { Player } from "@lottiefiles/react-lottie-player";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="">
        <Player autoplay loop src={image} className="w-full bg-rose-500" />

        <Link
          to="/"
          className="flex items-center justify-center my-10 mt-4 text-blue-500 hover:underline"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
