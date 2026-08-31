// src/components/LarekApi.ts

import { IApi, ILarekApi, Product, ProductId, Order, SentOrder } from '../types';

/**
 * Класс для работы с API сервера "Веб-ларёк"
 * Реализует интерфейс ILarekApi
 */
export class LarekApi implements ILarekApi {
  constructor(private api: IApi) {}

  /**
   * Получить список всех товаров
   * GET /products
   * @returns Promise<Product[]> - массив товаров
   */
  getProducts(): Promise<Product[]> {
    return this.api.get<{ items: Product[] }>('/products')
      .then(response => response.items);
  }

  /**
   * Получить товар по ID
   * GET /product/{id}
   * @param id - идентификатор товара
   * @returns Promise<Product> - товар
   */
  getProduct(id: ProductId): Promise<Product> {
    return this.api.get<Product>(`/product/${id}`);
  }

  /**
   * Отправить заказ на сервер
   * POST /order
   * @param order - данные заказа
   * @returns Promise<SentOrder> - ответ сервера с подтверждением
   */
  postOrder(order: Order): Promise<SentOrder> {
    return this.api.post<SentOrder>('/order', order, 'POST');
  }
}