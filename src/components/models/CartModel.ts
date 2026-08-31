// src/components/models/CartModel.ts

import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель для управления корзиной
 * Хранит список товаров, выбранных для покупки
 */
export class CartModel {
  private _items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  /**
   * Получить все товары в корзине
   */
  getItems(): IProduct[] {
    return [...this._items];
  }

  /**
   * Добавить товар в корзину
   */
  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this._items.push(product);
      this.events.emit('cart:change', this.getItems());
    }
  }

  /**
   * Удалить товар из корзины по ID
   */
  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('cart:change', this.getItems());
  }

  /**
   * Очистить корзину
   */
  clear(): void {
    this._items = [];
    this.events.emit('cart:change', this.getItems());
  }

  /**
   * Получить общую стоимость товаров в корзине
   */
  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /**
   * Получить количество товаров в корзине
   */
  getCount(): number {
    return this._items.length;
  }

  /**
   * Проверить наличие товара в корзине по ID
   */
  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}