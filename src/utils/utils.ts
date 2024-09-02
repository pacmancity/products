import {TProductCard} from '../types/product';

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function toMillimeters(inches: number) {
  const millimetersPerInch = 25.4;
  return Math.round(inches * millimetersPerInch) + ' mm';
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function filterDeleted(products: TProductCard[], deletedProducts: Record<number, true>): TProductCard[] {
  return products.filter(product => !deletedProducts[product.id]);
}

export function paginate(products: TProductCard[], page: number): TProductCard[] {
  const limit = 6
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return products.slice(startIndex, endIndex);
}

export const CATEGORY_LIST = [
  {value: "beauty", label: "beauty"},
  {value: "fragrances", label: "fragrances"},
  {value: "furniture", label: "furniture"},
  {value: "groceries", label: "groceries"},
  {value: "home-decoration", label: "home-decoration"},
  {value: "kitchen-accessories", label: "kitchen-accessories"},
  {value: "laptops", label: "laptops"},
  {value: "mens-shirts", label: "mens-shirts"},
  {value: "mens-shoes", label: "mens-shoes"},
  {value: "mens-watches", label: "mens-watches"},
  {value: "mobile-accessories", label: "mobile-accessories"},
  {value: "motorcycle", label: "motorcycle"},
  {value: "skin-care", label: "skin-care"},
  {value: "smartphones", label: "smartphones"},
  {value: "sports-accessories", label: "sports-accessories"},
  {value: "sunglasses", label: "sunglasses"},
  {value: "tablets", label: "tablets"},
  {value: "tops", label: "tops"},
  {value: "vehicle", label: "vehicle"},
  {value: "womens-bags", label: "womens-bags"},
  {value: "womens-dresses", label: "womens-dresses"},
  {value: "womens-jewellery", label: "womens-jewellery"},
  {value: "womens-shoes", label: "womens-shoes"},
  {value: "womens-watches", label: "womens-watches"},
]

export const WARRANTY_LIST = [
  {value: '1-month-warranty', label: 'Гарантия 1 месяц'},
  {value: '3-months-warranty', label: 'Гарантия 3 месяца'},
  {value: '6-months-warranty', label: 'Гарантия 6 месяцев'},
  {value: '1-year-warranty', label: 'Гарантия 1 год'},
  {value: '2-years-warranty', label: 'Гарантия 2 года'},
  {value: '3-years-warranty', label: 'Гарантия 3 года'},
  {value: '5-years-warranty', label: 'Гарантия 5 лет'},
  {value: '10-years-warranty', label: 'Гарантия 10 лет'},
  {value: 'lifetime-warranty', label: 'Пожизненная гарантия'},
];

export const SHIPPING_LIST = [
  {value: 'ships-in-1-week', label: 'Отправляется через 1 неделю'},
  {value: 'ships-in-2-weeks', label: 'Отправляется через 2 недели'},
  {value: 'ships-in-1-month', label: 'Отправляется через 1 месяц'},
  {value: 'ships-in-2-months', label: 'Отправляется через 2 месяца'},
  {value: 'ships-in-3-months', label: 'Отправляется через 3 месяца'},
  {value: 'ships-in-1-day', label: 'Отправляется через 1 день'},
  {value: 'ships-in-3-days', label: 'Отправляется через 3 дня'},
  {value: 'ships-same-day', label: 'Отправляется в тот же день'},
  {value: 'ships-asap', label: 'Отправляется как можно быстрее'},
];

export const AVAILABILITY_LIST = [
  {value: 'in_stock', label: 'В наличии'},
  {value: 'low_stock', label: 'Мало на складе'},
  {value: 'out_of_stock', label: 'Нет в наличии'},
  {value: 'preorder', label: 'Предзаказ'},
  {value: 'discontinued', label: 'Снято с производства'}
];

export const RETURN_POLICY_LIST = [
  {value: '30_days', label: 'Возврат в течение 30 дней'},
  {value: '60_days', label: 'Возврат в течение 60 дней'},
  {value: '14_days', label: 'Возврат в течение 14 дней'},
  {value: 'no_return', label: 'Без возврата'},
  {value: 'custom', label: 'Индивидуальная политика возврата'}
];

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_FILE_SIZE = 5242880; // 5 MB
