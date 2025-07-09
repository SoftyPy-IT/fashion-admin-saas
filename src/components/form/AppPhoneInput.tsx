import { useFormContext, Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

type TPhoneInputProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  international?: boolean;
  countryCallingCodeEditable?: boolean;
  required?: boolean;
};

const AppPhoneInput = ({
  name,
  label,
  disabled,
  placeholder,
  international,
  countryCallingCodeEditable = true,
}: TPhoneInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="mb-4">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col">
            {label && (
              <label htmlFor={name} className="mb-2 text-sm text-gray-700">
                {label}
              </label>
            )}
            <PhoneInput
              {...field}
              id={name}
              placeholder={placeholder}
              readOnly={disabled}
              disabled={disabled}
              defaultCountry="BD"
              international={international}
              countryCallingCodeEditable={countryCallingCodeEditable}
            />
            {error && <p className="mt-2 text-red-500">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
};

export default AppPhoneInput;
