# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения
 Приложение построено на основе паттерна MVP (Model-View-Presenter), который обеспечивает четкое разделение ответственности между слоями данных, представления и логики. Взаимодействие между компонентами организовано через событийно-ориентированный подход с использованием брокера событий EventEmitter.
### Данные

В приложении используются две сущности: Товар и Покупатель.
#### Товар

```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

 #### Покупатель

 ```typescript
type TPayment = 'card' | 'cash';
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

### Модули
Три класса для управления данными:

1. ProductModel — каталог товаров
Хранит список товаров и выбранный для просмотра товар.

```typescript
class ProductModel {
  private _items: IProduct[];
  private _previewId: string | null;

  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItem(id: string): IProduct | undefined;
  setPreview(id: string): void;
  getPreview(): IProduct | undefined;
}
2. CartModel — корзина
Хранит товары, выбранные для покупки.


class CartModel {
  private _items: IProduct[];

  constructor(events: EventEmitter);

  getItems(): IProduct[];
  addItem(product: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  hasItem(id: string): boolean;
}
3. OrderModel — покупатель
Хранит данные покупателя (способ оплаты, адрес, email, телефон).

typescript
class OrderModel {
  private _payment: TPayment | null;
  private _address: string;
  private _email: string;
  private _phone: string;

  constructor(events: EventEmitter);

  setPayment(method: TPayment): void;
  setAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  getOrderData(): IBuyer & { items: string[]; total: number };
  clear(): void;
  validate(): Partial<Record<keyof IBuyer, string>>;
}
```

## Слой коммуникации

### Класс LarekApi-работа с API сервера

Назначение: Взаимодействие с сервером "Веб-ларёк"-получение товаров и отправка заказов.

```typescript
interface ILarekApi {
  getProducts(): Promise<Product[]>;
  getProduct(id: ProductId): Promise<Product>;
  postOrder(order: Order): Promise<SentOrder>;
}

class LarekApi implements ILarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<Product[]> { ... }
  getProduct(id: ProductId): Promise<Product> { ... }
  postOrder(order: Order): Promise<SentOrder> { ... }
}
```

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

