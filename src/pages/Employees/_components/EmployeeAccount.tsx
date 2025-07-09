import { MdInfo } from "react-icons/md";

const steps = [
  { id: "01", name: "In Time", count: 20 },
  { id: "02", name: "Out Time", count: 10 },
  { id: "03", name: "Absent", count: 5 },
  { id: "04", name: "Vacation", count: 5 },
  { id: "05", name: "Late", count: 5 },
];

const getColor = (count: number) => {
  if (count >= 20) {
    return {
      border: "border-green-500",
      text: "text-green-500",
      iconColor: "text-green-500",
    };
  } else if (count >= 10) {
    return {
      border: "border-orange-500",
      text: "text-orange-500",
      iconColor: "text-orange-500",
    };
  } else {
    return {
      border: "border-red-500",
      text: "text-red-500",
      iconColor: "text-red-500",
    };
  }
};

const personalInformation = [
  {
    category: "Personal Information",
    fields: [
      { name: "Name", value: "Akbor Ali" },
      { name: "Email", value: "ali@gmail.com" },
      { name: "Phone", value: "0484848445" },
      { name: "Birth Day", value: "10-05-2024" },
      { name: "Address", value: "Kuril Bishawroad, Dhaka-1212" },
    ],
  },
  {
    category: "Emergency Contact",
    fields: [
      { name: "Name", value: "Akbor Ali" },
      { name: "Relationship", value: "Father" },
      { name: "Phone", value: "0484848445" },
      { name: "Religion", value: "Islam" },
      { name: "Nationality", value: "Bangladesh" },
    ],
  },
  {
    category: "Address Information",
    fields: [
      { name: "Country", value: "Bangladesh" },
      { name: "Town / City", value: "Dhaka" },
      { name: "Phone", value: "0484848445" },
      { name: "Address", value: "Kuril Bishawroad, Dhaka-1212" },
    ],
  },
];

const EmployeeAccount = () => {
  return (
    <div>
      <nav aria-label="Progress">
        <ol
          role="list"
          className="bg-white border border-gray-300 divide-y divide-gray-300 rounded-md md:flex md:divide-y-0"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative md:flex md:flex-1">
              <div className="flex items-center group">
                <span
                  className={`flex items-center px-6 py-4 text-sm font-medium ${
                    getColor(step.count).text
                  }`}
                >
                  <span
                    className={`flex items-center justify-center flex-shrink-0 2xl:w-20 2xl:h-20 h-10 w-10 border-2 rounded-full ${
                      getColor(step.count).border
                    }`}
                  >
                    <span className="texl-sm 2xl:text-lg">{step.count}%</span>
                  </span>
                  <span className="ml-4 text-sm 2xl:text-lg">{step.name}</span>
                </span>
              </div>

              {stepIdx !== steps.length - 1 && (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    className="absolute top-0 right-0 hidden w-5 h-full md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className={`w-full h-full text-gray-300`}
                      viewBox="0 0 10 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M5 0V80"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Account details */}
      <ul
        role="list"
        className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {personalInformation.map((category, index) => (
          <li
            key={index}
            className="overflow-hidden border border-gray-200 rounded"
          >
            <div className="flex items-center p-6 border-b gap-x-4 border-gray-900/5 bg-gray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full">
                <MdInfo className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-medium leading-6 text-gray-900">
                {category.category}
              </div>
            </div>
            <dl className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
              {category.fields.map((field, fieldIndex) => (
                <div
                  key={fieldIndex}
                  className="flex justify-between py-3 gap-x-4"
                >
                  <dt className="text-gray-500">{field.name}</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {field.value}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeAccount;
