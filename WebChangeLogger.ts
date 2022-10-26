import {IViewObject} from './types';

/**
 * @class WebChangeLogger
 */

export default class SyncWebChangelog {
  public STORAGE_VIEW_KEY: string  = 'changelog-view-key';
  public CURENT_VERSION: string;

  constructor(currentVersion: string, key?: string) {
    this.CURENT_VERSION = currentVersion;
    if (key) this.STORAGE_VIEW_KEY = key;
    let r: IViewObject | null | boolean | undefined = this.getLocalData();
    if (r === null) this.setLocalData({});
  }

  public setShowThisVersion(id: string) {
    return this.setId(this.CURENT_VERSION, id);
  }
  /**
   * Установить просмотр пользователя
   * @param version
   * @param id
   */
  public setId(version: string, id: string) {
    let r: IViewObject | null | boolean | undefined = this.getLocalData();
    if (!r) return null;
    if (!r[version]) r = this.setNewVersion(version); //Если нет версии то создаем
    if (!r) return null;
    // @ts-ignore
    if (r[version]?.includes(id)) return null;
    const newValue = { ...r };
    newValue[version].push(id);
    this.setLocalData(newValue);
  }

  /**
   * Установить новую версию
   */
  protected setNewVersion(version: string): IViewObject | null | undefined {
    const r: IViewObject | false = this.getLocalData();
    if (!r) return null;
    if (!r[version]) {
      const newValue = { ...r, [version]: [] };
      this.setLocalData(newValue);
      return newValue;
    }
  }

  /**
   * Получить последнюю версию
   */
  protected getLastVersion() {
    const r: IViewObject | false = this.getLocalData();
    if (!r) return null;
    return r[0];
  }

  /**
   * Может ли юзер видеть информацию
   * @param version - версия приложения
   * @param id - id пользователя
   */

  public isShowVersion(id: string, version?: string): boolean | null {
    const r: IViewObject | false = this.getLocalData();
    if (!r) return null;
    const _version = version ?? this.CURENT_VERSION;
    // @ts-ignore
    return r[_version]?.includes(id);
  }
  /**
   * Получаем данные из локального хранилища
   * @public
   */
  protected getLocalData(): IViewObject | false {
    try {
      const t = JSON.parse(localStorage.getItem(this.STORAGE_VIEW_KEY));
      return typeof t === 'object' ? t : false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Устанавливаем данные в локальное хранилище
   * @param value {IViewObject}
   * @protected
   */
  protected setLocalData(value: IViewObject) {
    if (typeof value !== 'object') return false;
    try {
      const t = JSON.stringify(value);
      localStorage.setItem(this.STORAGE_VIEW_KEY, t);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

