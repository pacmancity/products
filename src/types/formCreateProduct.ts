type TOption = { value: string, label: string };

export type TFormData = {
  title: string;
  description: string;
  price: number;
  category: TOption;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  warrantyInformation: TOption;
  shippingInformation: TOption;
  availabilityStatus: TOption;
  returnPolicy: TOption;
  minimumOrderQuantity: TOption;

  width: number;
  height: number;
  depth: number;
  barcode: number,
  thumbnail: File[];
  images: File[];
}
