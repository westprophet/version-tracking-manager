# Version Tracking Manager Library

Here is the documentation:

- [Русская Документация](https://github.com/westprophet/version-tracking-manager/blob/main/docs/README.ru.md)
- [Українська Документація](https://github.com/westprophet/version-tracking-manager/blob/main/docs/README.ua.md)

The **Version Tracking Manager** library is a JavaScript library that helps you manage and track which versions of your web application users have seen. It provides a simple and efficient way to display change logs or important information to users based on their interaction with different versions of your application.

## Installation

You can install the library using the following command:

```bash
yarn add version-tracking-manager
```

## Usage

To use the **Version Tracking Manager** library, follow these steps:

### Step 1: Initialize the Library

In your project, create a file (e.g., `version-tracking-manager.ts`) and initialize the library by importing it and providing the current version of your application, typically obtained from your `package.json` file.

```javascript
// version-tracking-manager.ts

import p from '../package.json';
import VersionTrackingManager from 'version-tracking-manager';

export default new VersionTrackingManager(p.version);
```

### Step 2: Mark Versions as Viewed

You can set the current version as viewed for a user by calling the `markVersionAsViewed` method. This method is used to track which users have seen the latest version of your application.

```javascript
const versionTrackingManager = new VersionTrackingManager(p.version);

// Mark the current version as viewed for a user
versionTrackingManager.markVersionAsViewed(userId);
```

### Step 3: Check if a User Has Seen a Version

To check if a user has seen a specific version of your application, use the `canUserSeeVersion` method. This method returns `true` if the user has seen the specified version, and `false` otherwise.

```javascript
const versionTrackingManager = new VersionTrackingManager(p.version);

// Check if a user has seen a specific version
const hasSeenVersion = versionTrackingManager.canUserSeeVersion(userId, version);
```

### Step 4: Skipping Version Checks

You can allow users to skip version checks during a session by using the `skipCheckThisSession` method. This is useful if you want to prevent version change notifications from appearing repeatedly within a single session.

```javascript
const versionTrackingManager = new VersionTrackingManager(p.version);

// Skip version check for the current session
versionTrackingManager.skipCheckThisSession();
```

## Contributing

We welcome contributions from the community. If you'd like to contribute to the **Version Tracking Manager** library, please follow our [contribution guidelines](link-to-contributions).

## Examples
Here are usage examples in React:

- [English Example](https://github.com/westprophet/version-tracking-manager/blob/main/examples/REACT-EXAMPLE.en.md)
- [Русский Пример](https://github.com/westprophet/version-tracking-manager/blob/main/examples/REACT-EXAMPLE.ru.md)
- [Український Приклад](https://github.com/westprophet/version-tracking-manager/blob/main/examples/REACT-EXAMPLE.ua.md)

## License

This library is licensed under the [MIT License](link-to-license).


