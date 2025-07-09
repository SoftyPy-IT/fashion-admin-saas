const AdminDashboard = () => {
  return (
    <div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5">
            <div className="flex justify-between mb-6">
              <div>
                <div className="mb-1 text-2xl font-semibold">10</div>
                <div className="text-sm font-medium text-gray-400">
                  Active orders
                </div>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full h-4 bg-gray-100 rounded-full">
                <div
                  className="h-full p-1 bg-blue-500 rounded-full"
                  style={{ width: "60px" }}
                >
                  <div className="w-2 h-2 ml-auto bg-white rounded-full"></div>
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-gray-600">
                60%
              </span>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5">
            <div className="flex justify-between mb-4">
              <div>
                <div className="flex items-center mb-1">
                  <div className="text-2xl font-semibold">324</div>
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">
                    +30%
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-400">
                  Visitors
                </div>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center">
              <img
                src="https://placehold.co/32x32"
                alt=""
                className="block object-cover w-8 h-8 rounded-full"
              />
              <img
                src="https://placehold.co/32x32"
                alt=""
                className="block object-cover w-8 h-8 -ml-3 rounded-full"
              />
              <img
                src="https://placehold.co/32x32"
                alt=""
                className="block object-cover w-8 h-8 -ml-3 rounded-full"
              />
              <img
                src="https://placehold.co/32x32"
                alt=""
                className="block object-cover w-8 h-8 -ml-3 rounded-full"
              />
              <img
                src="https://placehold.co/32x32"
                alt=""
                className="block object-cover w-8 h-8 -ml-3 rounded-full"
              />
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5">
            <div className="flex justify-between mb-6">
              <div>
                <div className="mb-1 text-2xl font-semibold">
                  <span className="text-base font-normal text-gray-400 align-top">
                    &dollar;
                  </span>
                  2,345
                </div>
                <div className="text-sm font-medium text-gray-400">
                  Active orders
                </div>
              </div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-blue-500 hover:text-blue-600"
            >
              View details
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5">
            <div className="flex items-start justify-between mb-4">
              <div className="font-medium">Manage orders</div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center mb-4 order-tab">
              <button
                type="button"
                data-tab="order"
                data-tab-page="active"
                className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-tl-md rounded-bl-md hover:text-gray-600 active"
              >
                Active
              </button>
              <button
                type="button"
                data-tab="order"
                data-tab-page="completed"
                className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 hover:text-gray-600"
              >
                Completed
              </button>
              <button
                type="button"
                data-tab="order"
                data-tab-page="canceled"
                className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-tr-md rounded-br-md hover:text-gray-600"
              >
                Canceled
              </button>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[540px]"
                data-tab-for="order"
                data-page="active"
              >
                <thead>
                  <tr>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                      Service
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Estimate
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Budget
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        In progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        In progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        In progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        In progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        In progress
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                className="w-full min-w-[540px] hidden"
                data-tab-for="order"
                data-page="completed"
              >
                <thead>
                  <tr>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                      Service
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Estimate
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Budget
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                className="w-full min-w-[540px] hidden"
                data-tab-for="order"
                data-page="canceled"
              >
                <thead>
                  <tr>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                      Service
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Estimate
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Budget
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Canceled
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Canceled
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Canceled
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Canceled
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        3 days
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $56
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Canceled
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5">
            <div className="flex items-start justify-between mb-4">
              <div className="font-medium">Manage Services</div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <form action="" className="flex items-center mb-4">
              <div className="relative w-full mr-2">
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 text-sm border border-gray-100 rounded-md outline-none bg-gray-50 focus:border-blue-500"
                  placeholder="Search..."
                />
                <i className="absolute text-gray-400 -translate-y-1/2 ri-search-line top-1/2 left-4"></i>
              </div>
              <select className="text-sm py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-md focus:border-blue-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center]">
                <option value="">All</option>
              </select>
            </form>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px]">
                <thead>
                  <tr>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                      Service
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Price
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Clicks
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        1K
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="flex items-center justify-center w-6 h-6 text-sm text-gray-400 rounded dropdown-toggle hover:text-gray-600 bg-gray-50"
                        >
                          <i className="ri-more-2-fill"></i>
                        </button>
                        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        1K
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="flex items-center justify-center w-6 h-6 text-sm text-gray-400 rounded dropdown-toggle hover:text-gray-600 bg-gray-50"
                        >
                          <i className="ri-more-2-fill"></i>
                        </button>
                        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        1K
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="flex items-center justify-center w-6 h-6 text-sm text-gray-400 rounded dropdown-toggle hover:text-gray-600 bg-gray-50"
                        >
                          <i className="ri-more-2-fill"></i>
                        </button>
                        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        1K
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="flex items-center justify-center w-6 h-6 text-sm text-gray-400 rounded dropdown-toggle hover:text-gray-600 bg-gray-50"
                        >
                          <i className="ri-more-2-fill"></i>
                        </button>
                        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        $235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-gray-400">
                        1K
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="flex items-center justify-center w-6 h-6 text-sm text-gray-400 rounded dropdown-toggle hover:text-gray-600 bg-gray-50"
                        >
                          <i className="ri-more-2-fill"></i>
                        </button>
                        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="font-medium">Order Statistics</div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border border-gray-200 border-dashed rounded-md">
                <div className="flex items-center mb-0.5">
                  <div className="text-xl font-semibold">10</div>
                  <span className="p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1">
                    $80
                  </span>
                </div>
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <div className="p-4 border border-gray-200 border-dashed rounded-md">
                <div className="flex items-center mb-0.5">
                  <div className="text-xl font-semibold">50</div>
                  <span className="p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1">
                    +$469
                  </span>
                </div>
                <span className="text-sm text-gray-400">Completed</span>
              </div>
              <div className="p-4 border border-gray-200 border-dashed rounded-md">
                <div className="flex items-center mb-0.5">
                  <div className="text-xl font-semibold">4</div>
                  <span className="p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1">
                    -$130
                  </span>
                </div>
                <span className="text-sm text-gray-400">Canceled</span>
              </div>
            </div>
            <div>
              <canvas id="order-chart"></canvas>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-md shadow-md shadow-black/5">
            <div className="flex items-start justify-between mb-4">
              <div className="font-medium">Earnings</div>
              <div className="dropdown">
                <button
                  type="button"
                  className="text-gray-400 dropdown-toggle hover:text-gray-600"
                >
                  <i className="ri-more-fill"></i>
                </button>
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px]">
                <thead>
                  <tr>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                      Service
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                      Earning
                    </th>
                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-emerald-500">
                        +$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-rose-500">
                        -$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Withdrawn
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-emerald-500">
                        +$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-rose-500">
                        -$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Withdrawn
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-emerald-500">
                        +$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-rose-500">
                        -$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Withdrawn
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-emerald-500">
                        +$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-rose-500">
                        -$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Withdrawn
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-emerald-500">
                        +$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <div className="flex items-center">
                        <img
                          src="https://placehold.co/32x32"
                          alt=""
                          className="block object-cover w-8 h-8 rounded"
                        />
                        <a
                          href="#"
                          className="ml-2 text-sm font-medium text-gray-600 truncate hover:text-blue-500"
                        >
                          Create landing page
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="text-[13px] font-medium text-rose-500">
                        -$235
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-b-gray-50">
                      <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">
                        Withdrawn
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
