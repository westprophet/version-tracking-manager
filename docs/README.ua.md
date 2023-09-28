# Бібліотека для відстеження версій

Бібліотека **Version Tracking Manager** - це бібліотека на JavaScript, яка допомагає вам керувати та відстежувати, які версії вашого веб-додатка користувачі бачили. Вона надає простий та ефективний спосіб відображення змінних журналів або важливої інформації для користувачів на основі їх взаємодії з різними версіями вашого додатка.

## Встановлення

Ви можете встановити бібліотеку за допомогою наступної команди:

```bash
yarn add version-tracking-manager
```

## Використання

Для використання бібліотеки **Version Tracking Manager** виконайте такі кроки:

### Крок 1: Ініціалізація бібліотеки

В вашому проекті створіть файл (наприклад, `version-tracking-manager.ts`) і ініціалізуйте бібліотеку, імпортуючи її та надаючи поточну версію вашого додатка, яку зазвичай отримуєте з файлу `package.json`.

```javascript
// version-tracking-manager.ts

import p from '../package.json';
import VersionTrackingManager from 'version-tracking-manager';

export default new VersionTrackingManager(p.version);
```

### Крок 2: Позначте версії як переглянуті

Ви можете встановити поточну версію як переглянуту для користувача, викликаючи метод `markVersionAsViewed`. Цей метод використовується для відстеження того, які користувачі бачили останню версію вашого додатка.

```javascript
const versionTrackingManager = new VersionTrackingManager(p.version);

// Позначте поточну версію як переглянуту для користувача
versionTrackingManager.markVersionAsViewed(userId);
```

### Крок 3: Перевірка, чи користувач бачив версію

Для перевірки, чи користувач бачив певну версію вашого додатка, використовуйте метод `canUserSeeVersion`. Цей метод повертає `true`, якщо користувач бачив зазначену версію, і `false` в іншому випадку.

```javascript
const versionTrackingManager = new VersionTrackingManager(p.version);

// Перевірте, чи користувач бачив певну версію
const hasSeenVersion = versionTrackingManager.canUserSeeVersion(userId, version);
```

### Крок 4: Пропуск перевірок версій

Ви можете дозволити користувачам пропускати перевірки версій протягом сесії за допомогою методу `skipCheckThisSession`. Це корисно, якщо ви хочете запобігти з'явленню сповіщень про зміну версій кілька разів під час однієї сесії.

```javascript
const versionTrackingManager = new VersionTrackingManager(p.version);

// Пропустіть перевірку версії для поточної сесії
versionTrackingManager.skipCheckThisSession();
```

## Внесення вкладу

Ми вітаємо внесок від спільноти. Якщо ви хочете внести внесок до бібліотеки **Version Tracking Manager**, будь ласка, дотримуйтесь наших [принципів внеску](посилання на внесок).

## Ліцензія

Ця бібліотека ліцензована за ліцензією [MIT License](посилання на ліцензію).
