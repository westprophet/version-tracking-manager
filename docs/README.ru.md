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

// Получите текущую версию приложения из package.json
const currentVersion = require('./package.json').version;

// Создайте экземпляр менеджера
const versionManager = new VersionTrackingManager(currentVersion);
```

### Установка флага для пользователя

```javascript
const userId = '123456';

// Установите флаг, указывающий, что пользователь видел текущую версию
versionManager.setIsShow(userId);
```

### Проверка, видел ли пользователь версию

```javascript
const userId = '123456';

// Проверьте, видел ли пользователь текущую версию приложения
const hasSeenVersion = versionManager.isShowVersion(userId);
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

## Описание методов

### `setIsShow(id: string)`

Устанавливает флаг для указанного пользователя, указывая, что он видел текущую версию приложения и больше не должен видеть уведомления.

- `id` (string): Идентификатор пользователя.

### `isShowVersion(id: string, version?: string): boolean | null`

Проверяет, видел ли пользователь указанную версию приложения.

- `id` (string): Идентификатор пользователя.
- `version` (string, опционально): Версия приложения для проверки (по умолчанию - текущая версия).

Возвращает `true`, если пользователь видел указанную версию, и `false`, если нет. Если пользователь не был найден в локальном хранилище, возвращается `null`.

### `skipCheckThisSession()`

Пропускает проверку для текущей сессии пользователя, что позволяет пользователю не видеть уведомления о текущей версии в течение текущей сессии.

## Лицензия

`VersionTrackingManager` лицензирован под MIT License.
