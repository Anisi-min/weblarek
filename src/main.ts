
// src/main.ts
import './scss/styles.scss';

// Базовые классы
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

// Модели данных
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';

// API клиент
import { LarekApi } from './components/LarekApi';

// ---- Инициализация ----

// 1. Брокер событий
const events = new EventEmitter();

// 2. API клиент (базовый)
const baseApi = new Api(import.meta.env.VITE_API_ORIGIN);

// 3. API для работы с приложением
const api = new LarekApi(baseApi);

// 4. Модели данных
const productModel = new ProductModel();
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

// ---- Загрузка товаров с сервера ----

async function loadProducts(): Promise<void> {
  try {
    console.log('🔄 Загрузка товаров с сервера...');

    const products = await api.getProducts();

    // Сохраняем товары в модель
    productModel.setItems(products);

    console.log('✅ Товары загружены!');
    console.log(`📦 Всего товаров: ${productModel.getItems().length}`);
    console.log('📋 Первый товар:', productModel.getItems()[0]);
  } catch (error) {
    console.error('❌ Ошибка загрузки товаров:', error);
  }
}

// ---- Проверка работы моделей (для отладки) ----

function testModels(): void {
  console.log('\n=== Проверка моделей ===');

  // Проверка ProductModel
  const allProducts = productModel.getItems();
  console.log('Товаров в каталоге:', allProducts.length);

  if (allProducts.length > 0) {
    const firstProduct = allProducts[0];
    const byId = productModel.getItem(firstProduct.id);
    console.log('Товар по ID:', byId?.title);
  }

  // Проверка CartModel
  console.log('Товаров в корзине:', cartModel.getCount());
  console.log('Общая стоимость:', cartModel.getTotal());

  // Проверка OrderModel
  const errors = orderModel.validate();
  console.log('Ошибки валидации:', errors);
}

// ---- Запуск приложения ----

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Приложение запущено!');

  // Загружаем товары с сервера
  loadProducts()
    .then(() => {
      testModels();
    })
    .catch((error) => {
      console.error('❌ Критическая ошибка:', error);
    });
});