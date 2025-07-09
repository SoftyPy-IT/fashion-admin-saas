const ProfileCard = () => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="px-6 py-8">
        <div className="flex justify-center mb-6">
          <img
            src="https://trust-auto-solution.vercel.app/assets/avatar-92fefd5a.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Ariful Islam</h1>
          <p className="text-gray-600">27, Bucharest, Romania</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-center text-gray-800">
              22
            </p>
            <p className="text-center text-gray-600">Overtime</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-center text-gray-800">
              10
            </p>
            <p className="text-center text-gray-600">Total Salary</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-center text-gray-800">
              89
            </p>
            <p className="text-center text-gray-600">March Paid</p>
          </div>
        </div>
      </div>
      <div className="px-6 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <p className="text-lg text-center text-gray-800">
            Designation - Staff
          </p>
          <p className="text-lg text-center text-gray-600">
            Employee ID- 123456789
          </p>
          <p className="text-lg text-center text-gray-600">
            Date of Join - 1st Jan 2024
          </p>
        </div>
      </div>

      <div className="flex justify-center py-4 border-t border-gray-200">
        <button className="px-4 py-2 font-semibold text-white uppercase transition duration-300 bg-blue-500 rounded shadow-md hover:bg-blue-600">
          Connect
        </button>
        <button className="px-4 py-2 ml-4 font-semibold text-gray-700 uppercase transition duration-300 bg-gray-200 rounded shadow-md hover:bg-gray-300">
          Message
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
