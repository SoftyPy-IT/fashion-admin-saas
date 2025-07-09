export type TOrderData = {
  _id: string;
  name: string;
  code: string;
  company: string;
  email: string;
  phone: string;
  isGuestCheckout: boolean;
  shippingCharge: number;
  billingAddress: {
    line1: string;
    line2?: string;
    country: string;
    district: string;
    division?: string;
    upazila: string;
    phone: string;
  };
  hasCoupon: boolean;
  couponCode?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    country: string;
    district: string;
    division?: string;
    upazila: string;
    phone: string;
  };
  paymentMethod: "PayPal" | "Skrill" | "Bank-in" | "Cash On Delivery";
  orderItems: {
    productId: string;
    name: string;
    thumbnail: string;
    price: number;
    quantity: number;
    variants: {
      name: string;
      value: string;
    }[];
    taxMethod: string;
    productTax: {
      type: string;
      rate: number;
    };
  }[];
  subTotal: number;
  discount: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  createdAt: string;
  updatedAt: string;
};
