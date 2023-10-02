# Менеджер відстеження версій (VersionTrackingManager)

`VersionTrackingManager` - це клас для відстеження версій веб-застосунка та контролю за тим, які версії бачили користувачі.

## Встановлення

Для встановлення бібліотеки `VersionTrackingManager` за допомогою `yarn`, виконайте таку команду:

```shell
yarn add version-tracking-manager
```

## Використання

### Створення екземпляра менеджера

```javascript
import VersionTrackingManager from 'version-tracking-manager';

// Отримайте поточну версію додатка
import { version as currentVersion } from './package.json';

// Створіть екземпляр менеджера
const versionManager = new VersionTrackingManager(currentVersion);
```

### Встановлення прапорця для користувача

```javascript
const userId = '123456';

// Встановіть прапорець, що користувач бачив поточну версію
versionManager.setVersionAsViewed(userId);
```

### Перевірка, чи бачив користувач версію

```javascript
const userId = '123456';

// Перевірте, чи користувач бачив поточну версію додатка
const hasSeenVersion = versionManager.canUserSeeVersion(userId);
if (hasSeenVersion) {
  // Користувач вже бачив поточну версію
} else {
  // Користувач ще не бачив поточну версію
}
```

### Пропуск перевірки версії в поточній сесії

```javascript
// Пропустіть перевірку версії для поточної сесії користувача
versionManager.skipCheckThisSession();
```

### Створення нового запису для версії

```javascript
const version = '1.2.0';

// Створіть новий запис для версії 1.2.0
const userData = versionManager.createNewVersionEntry(version);
if (userData) {
  // Запис для версії успішно створено
} else {
  // Під час створення запису сталася помилка
}
```

## Опис методів

### `setVersionAsViewed(userId: string)`

Встановлює прапорець для зазначеного користувача, вказуючи, що він бачив поточну версію додатка і більше не повинен бачити сповіщення.

- `userId` (string): Ідентифікатор користувача.

### `canUserSeeVersion(userId: string, version?: string): boolean | null`

Перевіряє, чи користувач бачив зазначену версію додатка.

- `userId` (string): Ідентифікатор користувача.
- `version` (string, опціонально): Версія додатка для перевірки (за замовчуванням - поточна версія).

Повертає `true`, якщо користувач бачив зазначену версію, і `false`, якщо ні. Якщо користувач не знайдений в локальному сховищі, повертається `null`.

### `skipCheckThisSession()`

Пропускає перевірку версії для поточної сесії користувача, що дозволяє користувачеві не бачити сповіщення про поточну версію під час поточної сесії.

### `createNewVersionEntry(version: string): IViewObject | null | undefined`

Створює новий запис для зазначеної версії додатка в даних користувача. Якщо версія вже існує в даних користувача, метод не виконує жодних дій.

- `version` (string): Версія додатка, для якої потрібно створити новий запис.

Повертає об'єкт даних користувача (`IViewObject`) після створення запису для зазначеної версії. Якщо дані користувача недоступні, метод повертає `null`. Якщо під час створення запису сталася помилка, метод повертає `undefined`.

## Приклад
React:
[Приклад](https://github.com/westprophet/version-tracking-manager/blob/main/examples/REACT-EXAMPLE.ua.md)

## Ліцензія

`VersionTrackingManager` ліцензується під ліцензією MIT.
