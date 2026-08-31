export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера со списком товаров
export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

// Тип для ошибок валидации (ключ — поле, значение — текст ошибки)
export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

export type ProductId = string;

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  category: string;
  price: number | null;
  image: string;
}

export interface Order {
  payment: 'card' | 'cash';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: ProductId[];
}

export interface SentOrder {
  id: string;
  total: number;
}

// ---- Типы для API ----

export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: string): Promise<T>;
}

export interface ILarekApi {
  getProducts(): Promise<Product[]>;
  getProduct(id: ProductId): Promise<Product>;
  postOrder(order: Order): Promise<SentOrder>;
}