import { useCallback } from "react";
import * as Yup from "yup";

interface ValidationSchemaType {
  validate: (data: any, options?: Yup.ValidateOptions) => Promise<any>;
}

const useYupValidationResolver = (validationSchema: ValidationSchemaType) =>
  useCallback(
    async (data: any) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        if (errors instanceof Yup.ValidationError) {
          // If it's a Yup.ValidationError, convert it to the desired format
          return {
            values: {},
            errors: errors.inner.reduce(
              (allErrors: any, currentError: Yup.ValidationError) => ({
                ...allErrors,
                [currentError.path ?? ""]: {
                  type: currentError.type ?? "validation",
                  message: currentError.message,
                },
              }),
              {}
            ),
          };
        } else {
          // If it's not a Yup.ValidationError, handle it accordingly
          console.error("Validation error:", errors);
          return {
            values: {},
            errors: { general: "Validation error occurred" },
          };
        }
      }
    },
    [validationSchema]
  );

export default useYupValidationResolver;
