// src/components/models/OrderModel.ts

import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Модель для управления данными покупателя и заказа
 */
export class OrderModel {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  constructor(private events: EventEmitter) {}

  /**
   * Установить способ оплаты
   */
  setPayment(method: TPayment): void {
    this._payment = method;
    this.events.emit('order:change', this.getOrderData());
  }

  /**
   * Установить адрес
   */
  setAddress(address: string): void {
    this._address = address;
    this.events.emit('order:change', this.getOrderData());
  }

  /**
   * Установить email
   */
  setEmail(email: string): void {
    this._email = email;
    this.events.emit('order:change', this.getOrderData());
  }

  /**
   * Установить телефон
   */
  setPhone(phone: string): void {
    this._phone = phone;
    this.events.emit('order:change', this.getOrderData());
  }

  /**
   * Получить все данные для заказа
   */
  getOrderData(): IBuyer & { items: string[]; total: number } {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      email: this._email,
      phone: this._phone,
      items: [], // будет заполнено из корзины
      total: 0, // будет заполнено из корзины
    };
  }

  /**
   * Очистить все данные покупателя
   */
  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
    this.events.emit('order:change', this.getOrderData());
  }

  /**
   * Валидация полей
   * Возвращает объект с ошибками. Ключ — поле, значение — текст ошибки.
   * Если ошибок нет — возвращает {}.
   */
  validate(): TValidationErrors {
    const errors: TValidationErrors = {};

    if (!this._payment) errors.payment = 'Не выбран способ оплаты';
    if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
    if (!this._email.trim()) errors.email = 'Укажите email';
    if (!this._phone.trim()) errors.phone = 'Укажите номер телефона';

    return errors;
  }
}