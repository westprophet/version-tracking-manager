
# Version Tracking Manager (VersionTrackingManager)

`VersionTrackingManager` is a class for tracking versions of a web application and controlling which versions users have seen.

## Installation

To install the `VersionTrackingManager` library using `yarn`, run the following command:

```shell
yarn add version-tracking-manager
```

## Usage

### Creating an Instance of the Manager

```javascript
import VersionTrackingManager from 'version-tracking-manager';

// Get the current application version
import { version as currentVersion } from './package.json';

// Create an instance of the manager
const versionManager = new VersionTrackingManager(currentVersion);
```

### Setting a Flag for a User

```javascript
const userId = '123456';

// Set a flag indicating that the user has seen the current version
versionManager.setVersionAsViewed(userId);
```

### Checking If a User Has Seen a Version

```javascript
const userId = '123456';

// Check if the user has seen the current version of the application
const hasSeenVersion = versionManager.canUserSeeVersion(userId);
if (hasSeenVersion) {
  // The user has already seen the current version
} else {
  // The user has not seen the current version yet
}
```

### Skipping Version Checking in the Current Session

```javascript
// Skip version checking for the current user session
versionManager.skipCheckThisSession();
```

### Creating a New Entry for a Version

```javascript
const version = '1.2.0';

// Create a new entry for version 1.2.0
const userData = versionManager.createNewVersionEntry(version);
if (userData) {
  // The entry for the version was successfully created
} else {
  // An error occurred while creating the entry
}
```

## Method Descriptions

### `setVersionAsViewed(userId: string)`

Sets a flag for the specified user indicating that they have seen the current version of the application and should no longer see notifications.

- `userId` (string): User identifier.

### `canUserSeeVersion(userId: string, version?: string): boolean | null`

Checks if the user has seen the specified version of the application.

- `userId` (string): User identifier.
- `version` (string, optional): Version of the application to check (default is the current version).

Returns `true` if the user has seen the specified version, `false` otherwise. If the user is not found in the local storage, it returns `null`.

### `skipCheckThisSession()`

Skips version checking for the current user session, allowing the user to not see notifications about the current version during the current session.

### `createNewVersionEntry(version: string): IViewObject | null | undefined`

Creates a new entry for the specified version of the application in the user's data. If the version already exists in the user's data, the method does nothing.

- `version` (string): Version of the application for which to create a new entry.

Returns the user's data object (`IViewObject`) after creating an entry for the specified version. If user data is not available, the method returns `null`. If an error occurs during the entry creation process, the method returns `undefined`.

## Examples
[React](https://github.com/westprophet/version-tracking-manager/blob/main/examples/REACT-EXAMPLE.en.md)
## License

`VersionTrackingManager` is licensed under the MIT License.
