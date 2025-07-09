import {
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleOutlined,
  QuestionOutlined,
  StarFilled,
  TagFilled,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Image,
  Rate,
  Row,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";
import { formatPrice } from "../../../libs";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// Interface definitions matching data structure
interface IVariantValue {
  name: string;
  value: string;
  quantity: number;
}

interface IVariant {
  name: string;
  values: IVariantValue[];
}

interface IFaq {
  question: string;
  answer: string;
  _id: string;
  id: string;
}

interface IProduct {
  _id: string;
  name: string;
  code: string;
  slug: string;
  reviews: any[];
  mainCategory: string;
  category: string;
  productCost: number;
  price: number;
  taxMethod: string;
  description: string;
  short_description: string;
  thumbnail: string;
  images: string[];
  discount_price: number;
  tags: string[];
  stock: number;
  is_stockout: boolean;
  quantity: number;
  folder: string;
  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  total_sale: number;
  rating: number;
  faq: IFaq[];
  variants: IVariant[];
  hasVariants: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  subCategory: string;
  total_reviews: number;
  id: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug: string;
  reviews: any[];
  price: number;
  thumbnail: string;
  images: string[];
  discount_price: number;
  rating: number;
  category: string;
  subCategory?: string;
  mainCategory: string;
}

interface ProductDetailsPageProps {
  product: IProduct;
  relatedProducts?: RelatedProduct[];
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  relatedProducts = [],
}) => {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleVariantSelect = (variantName: string, valueName: string) => {
    setSelectedVariants({
      ...selectedVariants,
      [variantName]: valueName,
    });
  };

  const renderVariantSelector = () => {
    if (
      !product.hasVariants ||
      !product.variants ||
      product.variants.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-6">
        {product.variants.map((variant, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <TagFilled className="mr-2 text-blue-500" />
              <Text strong>{variant.name}</Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {variant.values.map((value, valueIndex) => (
                <Badge
                  key={valueIndex}
                  count={value.quantity || "0"}
                  overflowCount={99}
                  showZero
                  style={{
                    marginRight: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <Button
                    type={
                      selectedVariants[variant.name] === value.name
                        ? "primary"
                        : "default"
                    }
                    disabled={value.quantity <= 0}
                    onClick={() =>
                      handleVariantSelect(variant.name, value.name)
                    }
                    className={`min-w-20 ${
                      value.quantity <= 0 ? "opacity-50" : ""
                    }`}
                  >
                    {value.name}
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProductGallery = () => {
    return (
      <div className="mb-4">
        <div className="mb-4">
          <Image
            src={selectedImage}
            alt={product.name}
            className="rounded-lg "
            width="100%"
            // height={400}
            preview={true}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border-2 rounded overflow-hidden ${
                selectedImage === image ? "border-blue-500" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Product Image ${index + 1}`}
                preview={false}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProductInfo = () => {
    const discount = product.discount_price > 0;
    const discountPercentage = discount
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100,
        )
      : 0;

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <Title level={2} className="mb-0">
            {product.name}
          </Title>
          <div className="flex gap-2">
            {product.is_featured && (
              <Tag color="gold" icon={<StarFilled />}>
                Featured
              </Tag>
            )}
            {product.is_active ? (
              <Tag color="green" icon={<CheckCircleFilled />}>
                Active
              </Tag>
            ) : (
              <Tag color="red" icon={<CloseCircleFilled />}>
                Inactive
              </Tag>
            )}
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Text type="secondary" className="mr-4">
            Code: {product.code}
          </Text>
          <Text type="secondary">Slug: {product.slug}</Text>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline">
            {discount ? (
              <>
                <Title level={3} className="mb-0 text-red-500">
                  {formatPrice(product.discount_price)}
                </Title>
                <Text delete type="secondary" className="ml-2 text-lg">
                  {formatPrice(product.price)}
                </Text>
                <Tag color="red" className="ml-2">
                  -{discountPercentage}%
                </Tag>
              </>
            ) : (
              <Title level={3} className="mb-0">
                {formatPrice(product.price)}
              </Title>
            )}
          </div>
          <Text type="secondary">
            Cost: {formatPrice(product.productCost)} | Tax: {product.taxMethod}
          </Text>
        </div>

        <div className="flex items-center mb-4">
          <Rate
            disabled
            defaultValue={product.rating}
            className="mr-2 text-amber-500"
          />
          <Text>
            {product.rating}/5 ({product.total_reviews} reviews)
          </Text>
        </div>

        <div className="mb-4">
          {product.is_stockout ? (
            <Badge status="error" text="Out of Stock" />
          ) : (
            <Badge
              status="success"
              text={`In Stock (${product.stock} available)`}
            />
          )}
        </div>

        <Divider className="my-4" />

        <div className="mb-4">
          <Paragraph className="text-gray-700">
            {product.short_description}
          </Paragraph>
        </div>

        {renderVariantSelector()}
      </div>
    );
  };

  if (!product) return null;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="mb-6 shadow-sm">
        <Row gutter={24}>
          <Col xs={24} lg={10} className="mb-6 lg:mb-0">
            {renderProductGallery()}
          </Col>
          <Col xs={24} lg={14}>
            {renderProductInfo()}
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="description"
        className="p-4 bg-white rounded-lg shadow-sm"
      >
        <TabPane
          tab={
            <span className="flex items-center">
              <InfoCircleOutlined className="mr-2" />
              Description
            </span>
          }
          key="description"
        >
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </TabPane>

        {product.faq.length > 0 && (
          <TabPane
            tab={
              <span className="flex items-center">
                <QuestionOutlined className="mr-2" />
                FAQs ({product.faq.length})
              </span>
            }
            key="faqs"
          >
            <Collapse className="bg-white border-0 shadow-none">
              {product.faq.map((faq, index) => (
                <Panel
                  header={<Text strong>{faq.question}</Text>}
                  key={index}
                  className="mb-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <Text>{faq.answer}</Text>
                </Panel>
              ))}
            </Collapse>
          </TabPane>
        )}

        <TabPane
          tab={
            <span className="flex items-center">
              <TagFilled className="mr-2" />
              Specifications
            </span>
          }
          key="specifications"
        >
          <Card bordered={false} className="bg-gray-50">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Categories" className="h-full">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Main Category">
                      {product.mainCategory}
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                      {product.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sub Category">
                      {product.subCategory}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Meta Information" className="h-full">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Meta Title">
                      {product.meta_title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Meta Description">
                      {product.meta_description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Meta Keywords">
                      {product.meta_keywords.map((keyword, index) => (
                        <Tag key={index} className="mr-1">
                          {keyword}
                        </Tag>
                      ))}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24}>
                <Card title="Additional Details">
                  <Descriptions bordered>
                    <Descriptions.Item label="Product ID" span={3}>
                      {product._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At" span={3}>
                      <CalendarOutlined className="mr-2" />
                      {formatDate(product.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At" span={3}>
                      <CalendarOutlined className="mr-2" />
                      {formatDate(product.updatedAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Available">
                      {product.is_available ? (
                        <CheckCircleFilled className="text-green-500" />
                      ) : (
                        <CloseCircleFilled className="text-red-500" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Featured">
                      {product.is_featured ? (
                        <CheckCircleFilled className="text-green-500" />
                      ) : (
                        <CloseCircleFilled className="text-red-500" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Active">
                      {product.is_active ? (
                        <CheckCircleFilled className="text-green-500" />
                      ) : (
                        <CloseCircleFilled className="text-red-500" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Sales">
                      <Statistic value={product.total_sale} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Folder ID" span={2}>
                      {product.folder}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {relatedProducts.length > 0 && (
        <Card
          title={<Title level={4}>Related Products</Title>}
          className="mt-6 shadow-sm"
        >
          <Row gutter={[16, 16]}>
            {relatedProducts.map((related) => (
              <Col key={related._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div className="h-48 overflow-hidden">
                      <img
                        alt={related.name}
                        src={related.thumbnail}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  }
                  className="h-full"
                >
                  <div className="flex flex-col h-full">
                    <Title level={5} className="mb-2">
                      {related.name}
                    </Title>

                    <div className="flex items-center mb-2">
                      <Text strong className="mr-2 text-lg text-red-500">
                        {formatPrice(related.price)}
                      </Text>
                      {related.discount_price > 0 && (
                        <Text delete type="secondary">
                          {formatPrice(related.discount_price)}
                        </Text>
                      )}
                    </div>

                    <div className="mb-2">
                      <Tag color="blue">{related.category}</Tag>
                      {related.subCategory && (
                        <Tag color="cyan">{related.subCategory}</Tag>
                      )}
                    </div>

                    {related.rating > 0 && (
                      <div className="mt-auto">
                        <Rate
                          disabled
                          defaultValue={related.rating}
                          className="text-sm text-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ProductDetailsPage;
