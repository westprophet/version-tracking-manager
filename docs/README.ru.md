# Менеджер отслеживания версий (VersionTrackingManager)

`VersionTrackingManager` - это класс для отслеживания версий веб-приложения и контроля за тем, какие версии видели пользователи.

## Установка

Для установки библиотеки `VersionTrackingManager` с помощью `yarn`, выполните следующую команду:

```shell
yarn add version-tracking-manager
```

## Использование

### Создание экземпляра менеджера

```javascript
import VersionTrackingManager from 'version-tracking-manager';

// Получите текущую версию приложения
import { version as currentVersion } from './package.json';

// Создайте экземпляр менеджера
const versionManager = new VersionTrackingManager(currentVersion);
```

### Установка флага для пользователя

```javascript
const userId = '123456';

// Установите флаг, указывающий, что пользователь видел текущую версию
versionManager.setVersionAsViewed(userId);
```

### Проверка, видел ли пользователь версию

```javascript
const userId = '123456';

// Проверьте, видел ли пользователь текущую версию приложения
const hasSeenVersion = versionManager.canUserSeeVersion(userId);
if (hasSeenVersion) {
  // Пользователь уже видел текущую версию
} else {
  // Пользователь еще не видел текущую версию
}
```

### Пропуск проверки в текущей сессии

```javascript
// Пропустите проверку для текущей сессии пользователя
versionManager.skipCheckThisSession();
```

### Создание новой записи для версии

```javascript
const version = '1.2.0';

// Создать новую запись для версии 1.2.0
const userData = versionManager.createNewVersionEntry(version);
if (userData) {
  // Успешно создана запись для версии
} else {
  // Произошла ошибка при создании записи
}
```

## Описание методов

### `setVersionAsViewed(userId: string)`

Устанавливает флаг для указанного пользователя, указывая, что он видел текущую версию приложения и больше не должен видеть уведомления.

- `userId` (string): Идентификатор пользователя.

### `canUserSeeVersion(userId: string, version?: string): boolean | null`

Проверяет, видел ли пользователь указанную версию приложения.

- `userId` (string): Идентификатор пользователя.
- `version` (string, опционально): Версия приложения для проверки (по умолчанию - текущая версия).

Возвращает `true`, если пользователь видел указанную версию, и `false`, если нет. Если пользователь не был найден в локальном хранилище, возвращается `null`.

### `skipCheckThisSession()`

Пропускает проверку для текущей сессии пользователя, что позволяет пользователю не видеть уведомления о текущей версии в течение текущей сессии.

### `createNewVersionEntry(version: string): IViewObject | null | undefined`

Создает новую запись для указанной версии приложения в данных пользователя. Если версия уже существует в данных пользователя, метод не выполняет никаких действий.

- `version` (string): Версия приложения, для которой требуется создать новую запись.

Возвращает объект данных пользователя (`IViewObject`) после создания записи для указанной версии. Если данные пользователя не доступны, метод возвращает `null`. Если произошла ошибка в процессе создания записи, метод возвращает `undefined`.

## Пример
[React](https://github.com/westprophet/version-tracking-manager/blob/main/examples/REACT-EXAMPLE.ru.md)

## Лицензия

`VersionTrackingManager` лицензирован под MIT License.

