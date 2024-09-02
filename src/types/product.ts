type TDimensions = {
  width: number;
  height: number;
  depth: number;
};

type TReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type TMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

type TProductDetail = {
  category: string;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  dimensions: TDimensions;
  meta: TMeta;
  images: string[];
  reviews: TReview[]
};

export type TProductHeader = {
  apiType: 'dummyApi' | 'airtable' // флаг, чтобы знать на какую api отпралять запрос
  title: string;
  description: string;
  thumbnail: string;
  price: number;
};
export type TProductCard = TProductHeader & { id: number };
export type TProduct = TProductCard & TProductDetail;
