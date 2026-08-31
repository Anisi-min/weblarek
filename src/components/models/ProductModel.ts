// src/components/models/ProductModel.ts

import { IProduct } from '../../types';

/**
 * Модель для управления каталогом товаров
 * Хранит список всех товаров и ID выбранного для просмотра товара
 */
export class ProductModel {
  private _items: IProduct[] = [];
  private _previewId: string | null = null;

  /**
   * Сохранить массив товаров
   */
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  /**
   * Получить все товары
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Получить товар по ID
   */
  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  /**
   * Установить ID товара для предпросмотра
   */
  setPreview(id: string): void {
    this._previewId = id;
  }

  /**
   * Получить товар для предпросмотра
   */
  getPreview(): IProduct | undefined {
    if (!this._previewId) return undefined;
    return this.getItem(this._previewId);
  }
}