import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../redux/features/product/product.api";
import useYupValidationResolver from "../libs/useYupValidationResolver";

type FAQ = {
  question: string;
  answer: string;
};

type VariantType = {
  name: string;
  values: {
    name: string;
    value: string;
    quantity: number;
    _id?: string;
  }[];
};

// Enhanced validation schema to match all form fields
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please enter product name"),
  code: Yup.string().required("Please enter product code"),
  price: Yup.number()
    .required("Please enter product price")
    .positive("Price must be positive"),
  productCost: Yup.number()
    .required("Please enter product cost")
    .positive("Cost must be positive"),
  folder: Yup.string().required("Please select a folder"),
  // supplier: Yup.string().required("Please select a supplier"),
  discount_price: Yup.number().optional(),
  quantity: Yup.number().optional(),

  // Categories
  mainCategory: Yup.string().required("Please select a main category"),
  category: Yup.string().required("Please select a category"),
  subCategory: Yup.string().nullable(),

  // Descriptions
  short_description: Yup.string().required("Please enter short description"),
  description: Yup.string()
    .transform((value) => value || "")
    .default(""),

  // Tags and metadata
  // tags: Yup.array().of(Yup.string()).required("Please add at least one tag"),
  meta_title: Yup.string()
    .required("Please enter meta title")
    .max(60, "Meta title should be maximum 60 characters"),
  meta_keywords: Yup.array()
    .of(Yup.string())
    .required("Please add at least one meta keyword"),
  meta_description: Yup.string()
    .required("Please enter meta description")
    .max(160, "Meta description should be maximum 160 characters"),

  // FAQs
  faq: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required("Please enter question"),
      answer: Yup.string().required("Please enter answer"),
    }),
  ),
});

export const useProductForm = (
  initialValues: any = {},
  productId: string | null = null,
  needToUpdate: boolean = false,
) => {
  // FAQs management
  const [faqs, setFaqs] = useState<FAQ[]>(
    initialValues?.faq || [{ question: "", answer: "" }],
  );

  // Category selections
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(initialValues?.mainCategory || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialValues?.category || null,
  );

  // Variants management
  const [hasVariants, setHasVariants] = useState<boolean>(
    initialValues?.hasVariants || false,
  );
  const [variants, setVariants] = useState<VariantType[]>(
    initialValues?.variants || [{ name: "", values: [] }],
  );

  // Tags and metadata
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [metaKeywords, setMetaKeywords] = useState<string[]>(
    initialValues?.meta_keywords || [],
  );

  // Image management
  const [thumbnailVisible, setThumbnailVisible] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    initialValues?.thumbnail || "",
  );
  const [selectedImages, setSelectedImages] = useState<string[]>(
    initialValues?.images || [],
  );

  // size_chart
  const [sizeChartVisible, setSizeChartVisible] = useState(false);
  const [selectedSizeChart, setSelectedSizeChart] = useState<string | null>(
    initialValues?.size_chart || "",
  );

  // Form state
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Navigation and mutations
  const navigate = useNavigate();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Validation resolver
  const resolver = useYupValidationResolver(validationSchema);

  // Form submission handler
  const onFinish = async (data: any) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = {
      ...data,
      hasVariants,
      variants: hasVariants
        ? variants.map((variant) => ({
            name: variant.name,
            values: variant.values.map((value) => ({
              name: value.name,
              value: value.value,
              quantity: value.quantity,
              _id: value._id,
            })),
          }))
        : [],
      faqs,
      tags,
      metaKeywords,
      thumbnail: selectedThumbnail,
      images: selectedImages,
      sizeChart: selectedSizeChart,
    };

    try {
      const res =
        productId && needToUpdate
          ? await updateProduct({ ...finalData, _id: productId }).unwrap()
          : await createProduct(finalData).unwrap();

      if (res.success) {
        setIsSuccess(true);
        toast.success(res.message, { id: toastId, duration: 2000 });
        setError(null);

        // Navigate based on the folder selection
        if (data.folder) {
          navigate(`/dashboard/products/folders/${data.folder}`);
        } else {
          navigate("/dashboard/products/manage");
        }
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.errorSources
          ?.map((error: any) => error.message)
          .join(", ") || "Something went wrong";

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId, duration: 2000 });
    }
  };

  // FAQ handlers
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    const values = [...faqs];
    values.splice(index, 1);
    setFaqs(values);
  };

  const handleFaqChange = (index: number, field: keyof FAQ, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
  };

  // Variant handlers
  const handleAddVariant = () => {
    setVariants([...variants, { name: "", values: [] }]);
  };

  const handleRemoveVariant = (index: number) => {
    const values = [...variants];
    values.splice(index, 1);
    setVariants(values);
  };

  const handleVariantNameChange = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], name: value, values: [] }; // Reset values when name changes
    setVariants(newVariants);
  };

  const handleAddVariantValue = (
    index: number,
    values: { name: string; value: string; quantity: number; _id?: string }[],
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], values: values };
    setVariants(newVariants);
  };

  // Main Category handling
  const handleMainCategoryChange = (value: string) => {
    setSelectedMainCategory(value);
    setSelectedCategory(null); // Reset category when main category changes
  };

  return {
    // Mutation states
    isSuccess,
    isCreating,
    isUpdating,

    // Form data
    faqs,
    setFaqs,
    selectedMainCategory,
    setSelectedMainCategory,
    selectedCategory,
    setSelectedCategory,

    // Variants
    hasVariants,
    setHasVariants,
    variants,
    setVariants,

    // Tags and metadata
    tags,
    setTags,
    metaKeywords,
    setMetaKeywords,

    // Images
    thumbnailVisible,
    setThumbnailVisible,
    imagesVisible,
    setImagesVisible,
    selectedThumbnail,
    setSelectedThumbnail,
    selectedImages,
    setSelectedImages,

    // Form state
    error,
    setError,

    // Handlers
    onFinish,
    handleAddFaq,
    handleRemoveFaq,
    handleFaqChange,
    handleAddVariant,
    handleRemoveVariant,
    handleVariantNameChange,
    handleAddVariantValue,
    handleMainCategoryChange,

    // Validation
    resolver,

    // Size chart
    sizeChartVisible,
    setSizeChartVisible,
    selectedSizeChart,
    setSelectedSizeChart,
  };
};
