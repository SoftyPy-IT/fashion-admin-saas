import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Image,
  Row,
  Spin,
  Tabs,
  Typography,
  Space,
  Tag,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import {
  FaImage,
  FaImages,
  FaInfoCircle,
  FaCog,
  FaQuestion,
  FaSearch,
} from "react-icons/fa";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import Editor from "../../../components/editor/inde";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppSelect from "../../../components/form/AppSelect";
import AppSelectWithWatch from "../../../components/form/AppSelectWithWatch";
import AppTextArea from "../../../components/form/AppTextArea";
import { useProductForm } from "../../../hooks/useProductForm";
import { useGetFoldersQuery } from "../../../redux/features/gallery/gallery.api";
import { useGetAllSuppliersQuery } from "../../../redux/features/people/supplier.api";
import {
  useGetCategoriesByMainCategoryQuery,
  useGetMainCategoriesQuery,
  useGetSubCategoriesByCategoryQuery,
} from "../../../redux/features/product/category.api";
import FaqSection from "./FaqSection";
import VariantsSection from "./VariantsSection";

const { Text, Title } = Typography;

interface ProductFormProps {
  initialValues?: any;
  productId?: string | null;
  isLoading?: boolean;
  needToUpdate?: boolean;
  folderId?: string;
}

const ProductForm = ({
  initialValues,
  productId = null,
  isLoading: externalLoading,
  needToUpdate = false,
  folderId,
}: ProductFormProps) => {
  const {
    isSuccess,
    isCreating,
    isUpdating,
    hasVariants,
    setHasVariants,
    variants,
    metaKeywords,
    setMetaKeywords,
    thumbnailVisible,
    setThumbnailVisible,
    imagesVisible,
    setImagesVisible,
    selectedThumbnail,
    setSelectedThumbnail,
    selectedImages,
    setSelectedImages,
    error,
    onFinish,
    handleAddVariant,
    handleRemoveVariant,
    handleVariantNameChange,
    handleAddVariantValue,
    resolver,
    sizeChartVisible,
    setSizeChartVisible,
    selectedSizeChart,
    setSelectedSizeChart,
  } = useProductForm(initialValues, productId, needToUpdate);

  // State for search params (with debounce strategy)
  const [folderSearchTerm, setFolderSearchTerm] = useState<string>("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState<string>("");

  // Memoized query params
  const folderParams = useMemo(
    () =>
      folderSearchTerm
        ? [
            { name: "searchTerm", value: folderSearchTerm },
            { name: "type", value: "product" },
          ]
        : [{ name: "type", value: "product" }],
    [folderSearchTerm],
  );

  const supplierParams = useMemo(
    () =>
      supplierSearchTerm
        ? [{ name: "searchTerm", value: supplierSearchTerm }]
        : [],
    [supplierSearchTerm],
  );

  // Category selection state
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(initialValues?.mainCategory || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialValues?.category || null,
  );

  // Queries
  const { data: folders, isLoading: folderLoading } =
    useGetFoldersQuery(folderParams);
  const { data: mainCategories, isLoading: mainCategoryLoading } =
    useGetMainCategoriesQuery(undefined);
  const { data: suppliers, isLoading: suppliersLoading } =
    useGetAllSuppliersQuery(supplierParams);

  // Categories query - dependent on main category selection
  const { data: categories, isLoading: categoryLoading } =
    useGetCategoriesByMainCategoryQuery(selectedMainCategory || "", {
      skip: !selectedMainCategory,
    });

  // Subcategories query - dependent on category selection
  const { data: subCategories, isLoading: subCategoryLoading } =
    useGetSubCategoriesByCategoryQuery(selectedCategory || "", {
      skip: !selectedCategory,
    });

  // Memoized options
  const folderOptions = useMemo(
    () =>
      folders?.data?.map((folder: any) => ({
        value: folder._id,
        label: folder.name,
      })) || [],
    [folders?.data],
  );

  const mainCategoriesOptions = useMemo(
    () =>
      mainCategories?.data?.map((item: { _id: string; name: string }) => ({
        value: item._id,
        label: item.name,
      })) || [],
    [mainCategories?.data],
  );

  const categoriesOptions = useMemo(
    () =>
      categories?.data?.map((item: { _id: string; name: string }) => ({
        value: item._id,
        label: item.name,
      })) || [],
    [categories?.data],
  );

  const subCategoriesOptions = useMemo(
    () =>
      subCategories?.data?.map((item: { _id: string; name: string }) => ({
        value: item._id,
        label: item.name,
      })) || [],
    [subCategories?.data],
  );

  const suppliersOptions = useMemo(
    () =>
      suppliers?.data?.map((supplier: any) => ({
        value: supplier._id,
        label: supplier.name,
      })) || [],
    [suppliers?.data],
  );

  const metaKeywordsOptions = useMemo(
    () =>
      metaKeywords?.map((keyword: string) => ({
        value: keyword,
        label: keyword,
      })) || [],
    [metaKeywords],
  );

  // Callbacks
  const handleFolderSearch = useCallback((search: string) => {
    setFolderSearchTerm(search);
  }, []);

  const handleSupplierSearch = useCallback((search: string) => {
    setSupplierSearchTerm(search);
  }, []);

  const handleMainCategoryChange = useCallback((value: string) => {
    setSelectedMainCategory(value);
    setSelectedCategory(null);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  // Image preview component
  const ImagePreview = ({
    images,
    type = "gallery",
    onManage,
  }: {
    images: string | string[];
    type?: "thumbnail" | "gallery" | "sizeChart";
    onManage: () => void;
  }) => {
    const imageArray = Array.isArray(images) ? images : images ? [images] : [];

    if (imageArray.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center p-8 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:bg-gray-100">
          <FaImage className="mb-2 text-4xl text-gray-400" />
          <Text type="secondary" className="text-center">
            {type === "thumbnail"
              ? "No thumbnail selected"
              : type === "sizeChart"
              ? "No size chart selected"
              : "No gallery images selected"}
          </Text>
          <Button type="link" onClick={onManage} className="mt-2">
            {type === "thumbnail"
              ? "Select Thumbnail"
              : type === "sizeChart"
              ? "Select Size Chart"
              : "Add Images"}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {imageArray.map((image: string, index: number) => (
            <div key={image || index} className="relative group">
              <Image
                src={image}
                alt={`${type} image ${index + 1}`}
                width={type === "thumbnail" ? 120 : 80}
                height={type === "thumbnail" ? 120 : 80}
                className="object-cover rounded-lg border shadow-sm"
                preview={{
                  mask: <div className="text-white">Preview</div>,
                }}
              />
            </div>
          ))}
        </div>
        <Button
          type="primary"
          ghost
          onClick={onManage}
          icon={type === "gallery" ? <FaImages /> : <FaImage />}
          size="small"
        >
          {imageArray.length > 0 ? "Manage" : "Select"}{" "}
          {type === "thumbnail"
            ? "Thumbnail"
            : type === "sizeChart"
            ? "Size Chart"
            : "Images"}
        </Button>
      </div>
    );
  };

  // Tab items configuration
  const tabItems = [
    {
      key: "basic",
      label: (
        <span className="flex gap-2 items-center">
          <FaInfoCircle />
          Basic Information
        </span>
      ),
      children: (
        <div className="space-y-6">
          {/* Folder Selection */}
          <div className="grid grid-cols-1 gap-3 mb-4 text-sm lg:grid-cols-2">
            {/* Folder Selection Card */}
            <div className="relative p-3 bg-gradient-to-br from-blue-50 rounded-md to-blue-100/50">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-md"></div>
              <div className="ml-2">
                <h3 className="mb-1 text-sm font-semibold text-blue-900">
                  📁 Folder Location
                </h3>
                <p className="mb-2 text-xs text-blue-700">
                  Choose where to organize this product in your gallery
                  structure
                </p>
                <AppSelect
                  name="folder"
                  label="Select Folder"
                  options={folderOptions}
                  loading={folderLoading}
                  placeholder="🔍 Select or search folder..."
                  onSearch={handleFolderSearch}
                />
              </div>
            </div>

            {/* Variants Toggle Card */}
            <div className="relative p-3 bg-gradient-to-br from-purple-50 rounded-md to-purple-100/50">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-purple-600 rounded-l-md"></div>
              <div className="ml-2">
                <Checkbox
                  checked={hasVariants || false}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="text-sm font-semibold text-purple-900"
                >
                  ⚙️ Product Variants
                </Checkbox>
                <p className="mt-1 text-xs text-purple-700">
                  Enable for products with multiple options
                  <br />
                  <span className="opacity-70">
                    (size, color, material, etc.)
                  </span>
                </p>
                {hasVariants && (
                  <div className="px-2 py-1 mt-2 rounded border border-purple-200 bg-purple-100/50">
                    <p className="text-xs text-purple-600">
                      💡 Configure your variants in the "Variants" tab
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Row gutter={24}>
            <Col span={24} xl={14}>
              <Space direction="vertical" size="large" className="w-full">
                {/* Product Details */}
                <Card title="Product Details" className="shadow-sm">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <AppInput
                        name="name"
                        type="text"
                        label="Product Name"
                        placeholder="Ex: Premium Wireless Headphones"
                      />
                    </Col>
                    <Col span={24} md={12}>
                      <AppInput
                        name="code"
                        type="text"
                        label="Product Code"
                        placeholder="Ex: PROD-001"
                      />
                    </Col>
                    <Col span={24} md={12}>
                      <AppSelect
                        name="supplier"
                        label="Supplier"
                        options={suppliersOptions}
                        loading={suppliersLoading}
                        placeholder="Select supplier"
                        onSearch={handleSupplierSearch}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* Pricing & Inventory */}
                <Card title="Pricing & Inventory" className="shadow-sm">
                  <Row gutter={[16, 16]}>
                    <Col span={24} md={12}>
                      <AppInput
                        name="price"
                        type="number"
                        label="Selling Price"
                        placeholder="0.00"
                      />
                    </Col>
                    <Col span={24} md={12}>
                      <AppInput
                        name="productCost"
                        type="number"
                        label="Product Cost"
                        placeholder="0.00"
                      />
                    </Col>
                    <Col span={24} md={12}>
                      <AppInput
                        name="quantity"
                        type="number"
                        label="Stock Quantity"
                        placeholder="0"
                        required={false}
                      />
                    </Col>
                    <Col span={24} md={12}>
                      <AppInput
                        name="discount_price"
                        type="number"
                        label="Discount Price"
                        placeholder="0.00 (optional)"
                        required={false}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* Categories */}
                <Card title="Categories" className="shadow-sm">
                  <Alert
                    message="Category Selection Guide"
                    description="Select categories in sequence: Main Category → Category → Subcategory"
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <AppSelectWithWatch
                        onValueChange={handleMainCategoryChange}
                        name="mainCategory"
                        label="Main Category"
                        options={mainCategoriesOptions}
                        loading={mainCategoryLoading}
                        placeholder="Select main category"
                      />
                    </Col>
                    <Col span={24}>
                      <AppSelectWithWatch
                        onValueChange={handleCategoryChange}
                        name="category"
                        label="Category"
                        options={categoriesOptions}
                        loading={categoryLoading}
                        placeholder={
                          selectedMainCategory
                            ? "Select category"
                            : "Please select a main category first"
                        }
                        disabled={!selectedMainCategory}
                      />
                    </Col>
                    <Col span={24}>
                      <AppSelect
                        name="subCategory"
                        label="Subcategory (Optional)"
                        options={subCategoriesOptions}
                        placeholder={
                          selectedCategory
                            ? "Select subcategory"
                            : "Please select a category first"
                        }
                        loading={subCategoryLoading}
                        disabled={!selectedCategory}
                      />
                    </Col>
                  </Row>
                </Card>
              </Space>
            </Col>

            <Col span={24} xl={10}>
              <Space direction="vertical" size="large" className="w-full">
                {/* Product Images */}
                <Card title="Product Images" className="shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <Text strong className="text-base">
                        Thumbnail Image
                      </Text>
                      <Text type="secondary" className="block mb-3">
                        Main product image shown in listings
                      </Text>
                      <ImagePreview
                        images={selectedThumbnail || ""}
                        type="thumbnail"
                        onManage={() => setThumbnailVisible(true)}
                      />
                    </div>

                    <Divider />

                    <div>
                      <Text strong className="text-base">
                        Gallery Images
                      </Text>
                      <Text type="secondary" className="block mb-3">
                        Additional product images for detailed view
                      </Text>
                      <ImagePreview
                        images={selectedImages}
                        type="gallery"
                        onManage={() => setImagesVisible(true)}
                      />
                    </div>
                  </div>
                </Card>

                {/* Size Chart */}
                <Card title="Size Chart" className="shadow-sm">
                  <Text type="secondary" className="block mb-3">
                    Upload a size chart image to help customers choose the right
                    size
                  </Text>
                  <ImagePreview
                    images={selectedSizeChart || ""}
                    type="sizeChart"
                    onManage={() => setSizeChartVisible(true)}
                  />
                </Card>
              </Space>
            </Col>
          </Row>

          {/* Product Description */}
          <Card title="Product Description" className="shadow-sm">
            <Row gutter={[16, 24]}>
              <Col span={24}>
                <AppTextArea
                  name="short_description"
                  label="Short Description"
                  placeholder="Enter a concise summary (shown in product listings)"
                />
              </Col>
              <Col span={24}>
                <div>
                  <Text strong className="block mb-3 text-base">
                    Full Description
                  </Text>
                  <div className="overflow-hidden rounded-lg border">
                    <Editor
                      name="description"
                      defaultValue={initialValues?.description}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      ),
    },
    {
      key: "variants",
      label: (
        <span className="flex gap-2 items-center">
          <FaCog />
          Variants
          {!hasVariants && <Tag>Disabled</Tag>}
        </span>
      ),
      disabled: !hasVariants,
      children: (
        <Card className="shadow-sm">
          {hasVariants ? (
            <VariantsSection
              variants={variants as any}
              handleAddVariant={handleAddVariant}
              handleVariantNameChange={handleVariantNameChange}
              handleAddVariantValue={handleAddVariantValue}
              handleRemoveVariant={handleRemoveVariant}
            />
          ) : (
            <Alert
              message="Variants Not Enabled"
              description="Enable product variants in the Basic Information tab to configure options like size, color, material, etc."
              type="info"
              showIcon
              action={
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setHasVariants(true)}
                >
                  Enable Variants
                </Button>
              }
            />
          )}
        </Card>
      ),
    },
    {
      key: "faqs",
      label: (
        <span className="flex gap-2 items-center">
          <FaQuestion />
          FAQs
        </span>
      ),
      children: (
        <Card className="shadow-sm">
          <FaqSection />
        </Card>
      ),
    },
    {
      key: "seo",
      label: (
        <span className="flex gap-2 items-center">
          <FaSearch />
          SEO & Meta
        </span>
      ),
      children: (
        <Card title="Search Engine Optimization" className="shadow-sm">
          <Alert
            message="SEO Best Practices"
            description="Optimize your product for search engines with compelling titles and descriptions"
            type="info"
            showIcon
            className="mb-6"
          />
          <Row gutter={[16, 16]}>
            <Col span={24} lg={12}>
              <AppInput
                name="meta_title"
                type="text"
                label="Meta Title"
                placeholder="SEO-friendly title (recommended: 50-60 characters)"
              />
            </Col>
            <Col span={24} lg={12}>
              <AppSelectWithWatch
                name="meta_keywords"
                label="Meta Keywords"
                options={metaKeywordsOptions}
                mode="tags"
                onValueChange={(value) => setMetaKeywords(value as any)}
                placeholder="Enter relevant keywords"
              />
            </Col>
            <Col span={24}>
              <AppTextArea
                name="meta_description"
                label="Meta Description"
                placeholder="Compelling description for search results (recommended: 150-160 characters)"
              />
            </Col>
          </Row>
        </Card>
      ),
    },
  ];

  // Loading state
  const isLoading =
    externalLoading || folderLoading || mainCategoryLoading || suppliersLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4 h-screen">
        <Spin size="large" />
        <Text type="secondary">Loading product form...</Text>
      </div>
    );
  }

  return (
    <div className="">
      <Card>
        {/* Header */}
        <div className="pb-4 mb-6 border-b">
          <Title level={2} className="mb-2">
            {productId ? "Update Product" : "Create New Product"}
          </Title>
          <Text type="secondary">
            {productId
              ? "Make changes to your existing product"
              : "Add a new product to your inventory"}
          </Text>
        </div>

        {/* Messages */}
        {(error || isSuccess) && (
          <div className="mb-6">
            {error && <ErrorMessage errorMessage={error} />}
            {isSuccess && (
              <SuccessMessage
                successMessage={`Product ${
                  productId ? "updated" : "created"
                } successfully!`}
              />
            )}
          </div>
        )}

        <AppForm
          onSubmit={onFinish}
          resolver={resolver}
          defaultValues={{
            ...initialValues,
            description: initialValues?.description || "",
            folder: folderId || initialValues?.folder || "",
          }}
        >
          <Tabs
            defaultActiveKey="basic"
            type="card"
            size="large"
            items={tabItems}
            className="product-form-tabs"
          />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 mt-8 border-t">
            <Button size="large" disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              size="large"
              className="px-8"
            >
              {isCreating || isUpdating
                ? `${productId ? "Updating" : "Creating"}...`
                : `${productId ? "Update" : "Create"} Product`}
            </Button>
          </div>
        </AppForm>
      </Card>

      {/* Gallery Modals */}
      {thumbnailVisible && (
        <GalleryModal
          open={thumbnailVisible}
          onClose={() => setThumbnailVisible(false)}
          setSelectedImage={setSelectedThumbnail}
          mode="single"
          selectedImage={selectedThumbnail}
          isSelectThumbnail={true}
        />
      )}

      {imagesVisible && (
        <GalleryModal
          open={imagesVisible}
          onClose={() => setImagesVisible(false)}
          setSelectedImage={setSelectedImages}
          mode="multiple"
          selectedImage={selectedImages}
        />
      )}

      {sizeChartVisible && (
        <GalleryModal
          open={sizeChartVisible}
          onClose={() => setSizeChartVisible(false)}
          setSelectedImage={setSelectedSizeChart}
          mode="single"
          selectedImage={selectedSizeChart}
        />
      )}
    </div>
  );
};

export default ProductForm;
