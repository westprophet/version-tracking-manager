import { IViewObject } from './types';

/**
 * @class VersionTrackingManager
 * @description A class for tracking which versions of the web application users have seen.
 */
export default class VersionTrackingManager {
  public STORAGE_KEY: string = 'version-tracking-data';
  public CURRENT_VERSION: string;

  /**
   * @constructor
   * @param currentVersion - The current version of the application.
   * @param storageKey - Optional storage key for local storage (default is 'version-tracking-data').
   */
  constructor(currentVersion: string, storageKey?: string) {
    this.CURRENT_VERSION = currentVersion;
    if (storageKey) this.STORAGE_KEY = storageKey;
    let userData: IViewObject | null | boolean | undefined = this.getLocalUserData();

    // If user data is not available, initialize it as an empty object.
    if (userData === null) this.setLocalUserData({});
  }

  /**
   * Set the current version as viewed for a user.
   * @param userId - User's identifier.
   */
  public markVersionAsViewed(userId: string) {
    return this.setVersionAsViewed(this.CURRENT_VERSION, userId);
  }

  /**
   * Set a version as viewed for a user.
   * @param version - Version of the application.
   * @param userId - User's identifier.
   */
  public setVersionAsViewed(version: string, userId: string) {
    let userData: IViewObject | null | boolean | undefined = this.getLocalUserData();

    // If user data is not available, return null.
    if (!userData) return null;

    // If the version does not exist in the user data, create a new entry.
    if (!userData[version]) userData = this.createNewVersionEntry(version);

    // If user data is still not available, return null.
    if (!userData) return null;

    // Check if userId exists in the version array
    if (!Array.isArray(userData[version])) userData[version] = [];
    if (!userData[version].includes(userId)) {
      userData[version].push(userId);
      this.setLocalUserData(userData);
    }
  }

  /**
   * Create a new version entry.
   * @param version - Version of the application.
   */
  protected createNewVersionEntry(version: string): IViewObject | null | undefined {
    const userData: IViewObject | false = this.getLocalUserData();

    // If user data is not available, return null.
    if (!userData) return null;

    // If the version does not exist, create a new entry.
    if (!userData[version]) {
      const updatedData = { ...userData, [version]: [] };
      this.setLocalUserData(updatedData);
      return updatedData;
    }
  }

  /**
   * Get the last viewed version.
   */
  protected getLastViewedVersion() {
    const userData: IViewObject | false = this.getLocalUserData();

    // If user data is not available, return null.
    if (!userData) return null;

    // Return the last viewed version, which is not implemented in the current code.
    // You may need to implement this method according to your requirements.
    return userData[0];
  }

  /**
   * Check if a user can see information for a specific version.
   * @param userId - User's identifier.
   * @param version - Optional version of the application (default is the current version).
   * @returns Returns true if the user has seen the specified version, false otherwise.
   */
  public canUserSeeVersion(userId: string, version?: string): boolean | null {
    const userData: IViewObject | false = this.getLocalUserData();

    // If user data is not available, return null.
    if (!userData) return null;

    const targetVersion = version ?? this.CURRENT_VERSION;

    // Check if userId exists in the version array
    if (Array.isArray(userData[targetVersion])) {
      return userData[targetVersion].includes(userId);
    }

    return false;
  }

  /**
   * Get user data from local storage.
   * @protected
   */
  protected getLocalUserData(): IViewObject | false {
    try {
      const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null');
      return typeof storedData === 'object' ? storedData : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Set user data in local storage.
   * @param data - User data to be stored.
   * @protected
   */
  protected setLocalUserData(data: IViewObject) {
    if (typeof data !== 'object') return false;
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, serializedData);
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
