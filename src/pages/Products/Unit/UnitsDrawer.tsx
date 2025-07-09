import { Drawer, Button } from "antd";
import { useState } from "react";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import AppSelect from "../../../components/form/AppSelect";
import AppSelectWithWatch from "../../../components/form/AppSelectWithWatch";
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
} from "../../../redux/features/product/units.api";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
  units?: any[];
  isLoadingUnits?: boolean;
}

const validationSchema = yup.object().shape({
  unit_code: yup.string().required("Please enter unit code"),
  name: yup.string().required("Please enter unit name"),
});

const UnitsDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
  units = [],
  isLoadingUnits = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [isBaseUnit, setIsBaseUnit] = useState<boolean>(
    !!initialValues?.base_unit,
  );

  const operators = [
    { value: "*", label: "Multiply" },
    { value: "/", label: "Divide" },
    { value: "+", label: "Add" },
    { value: "-", label: "Subtract" },
  ];

  const operatorsOptions = operators.map((item) => ({
    value: item.value,
    label: `${item.label} (${item.value})`,
  }));

  const unitsOptions = units?.map((item: { _id: string; name: string }) => ({
    value: item._id,
    label: `${item.name}`,
  }));

  const [createUnit, { isSuccess, isLoading }] = useCreateUnitMutation();
  const [
    updateUnit,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateUnitMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    unit_code: initialValues?.unit_code || "",
    name: initialValues?.name || "",
    base_unit: initialValues?.base_unit || "",
    operator: initialValues?.operator || "",
    operation_value: initialValues?.operation_value || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    try {
      let res;
      const finalData = {
        unit_code: data.unit_code,
        name: data.name,
        base_unit: isBaseUnit ? data.base_unit : null,
        operator: isBaseUnit ? data.operator : null,
        operation_value: isBaseUnit ? data.operation_value : null,
      };
      if (needToUpdate && initialValues) {
        res = await updateUnit({
          id: initialValues.key,
          data: finalData,
        }).unwrap();
      } else {
        res = await createUnit(finalData).unwrap();
      }

      if (res.success === true) {
        toast.success(res.message, { id: toastId, duration: 2000 });
        setError(null);
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources
          ?.map((error: any) => error.message)
          .join(", ") || "Something went wrong",
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <>
      <Drawer
        title={needToUpdate ? "Update Unit" : "Create Unit"}
        onClose={onClose}
        open={open}
      >
        <div>
          {error && <ErrorMessage errorMessage={error} />}
          {(isSuccess || isSuccessUpdate) && (
            <SuccessMessage
              successMessage={
                needToUpdate
                  ? "Unit updated successfully"
                  : "Unit created successfully"
              }
            />
          )}
        </div>
        <AppForm
          onSubmit={onSubmit}
          resolver={resolver}
          defaultValues={defaultValues}
        >
          <AppInput
            type="text"
            name="unit_code"
            label="Unit Code"
            placeholder="Ex: KG"
          />

          <AppInput
            type="text"
            name="name"
            label="Unit Name"
            placeholder="Ex: Kilogram"
          />

          <AppSelectWithWatch
            name="base_unit"
            label="Base Unit"
            options={unitsOptions}
            disabled={isLoadingUnits}
            required={false}
            placeholder="Select Base Unit"
            loading={isLoadingUnits}
            onValueChange={(value) => {
              setIsBaseUnit(!!value);
            }}
          />

          {isBaseUnit && (
            <>
              <AppSelect
                name="operator"
                label="Operator"
                options={operatorsOptions}
                placeholder="Select Operator"
              />

              <AppInput
                type="number"
                name="operation_value"
                label="Operation Value"
                placeholder="Ex: 1000"
              />
            </>
          )}

          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full btn"
          >
            {needToUpdate ? "Update Unit" : "Create Unit"}
          </Button>
        </AppForm>
      </Drawer>
    </>
  );
};

export default UnitsDrawer;
