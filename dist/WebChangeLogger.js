"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class WebChangeLogger
 */
class SyncWebChangelog {
    constructor(currentVersion, key) {
        this.STORAGE_VIEW_KEY = 'changelog-view-key';
        this.CURENT_VERSION = currentVersion;
        if (key)
            this.STORAGE_VIEW_KEY = key;
        let r = this.getLocalData();
        if (r === null)
            this.setLocalData({});
    }
    // public init(id: string){
    //   //Если нет записи, то установить запись
    //   if(!this.isShowVersion(this.CURENT_VERSION, id))
    //     return this.setId(this.CURENT_VERSION, id);
    //   return false;
    // }
    /**
     * Установить просмотр пользователя
     * @param version
     * @param id
     */
    setId(version, id) {
        var _a;
        let r = this.getLocalData();
        if (!r)
            return null;
        if (!r[version])
            r = this.setNewVersion(version); //Если нет версии то создаем
        if (!r)
            return null;
        // @ts-ignore
        if ((_a = r[version]) === null || _a === void 0 ? void 0 : _a.includes(id))
            return null;
        const newValue = Object.assign({}, r);
        newValue[version].push(id);
        this.setLocalData(newValue);
    }
    /**
     * Установить новую версию
     */
    setNewVersion(version) {
        const r = this.getLocalData();
        if (!r)
            return null;
        if (!r[version]) {
            const newValue = Object.assign(Object.assign({}, r), { [version]: [] });
            this.setLocalData(newValue);
            return newValue;
        }
    }
    /**
     * Получить последнюю версию
     */
    getLastVersion() {
        const r = this.getLocalData();
        if (!r)
            return null;
        return r[0];
    }
    /**
     * Может ли юзер видеть информацию
     * @param version - версия приложения
     * @param id - id пользователя
     */
    isShowVersion(id, version) {
        var _a;
        const r = this.getLocalData();
        if (!r)
            return null;
        const _version = version !== null && version !== void 0 ? version : this.CURENT_VERSION;
        // @ts-ignore
        return (_a = r[_version]) === null || _a === void 0 ? void 0 : _a.includes(id);
    }
    /**
     * Получаем данные из локального хранилища
     * @public
     */
    getLocalData() {
        try {
            const t = JSON.parse(localStorage.getItem(this.STORAGE_VIEW_KEY));
            return typeof t === 'object' ? t : false;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    /**
     * Устанавливаем данные в локальное хранилище
     * @param value {IViewObject}
     * @protected
     */
    setLocalData(value) {
        if (typeof value !== 'object')
            return false;
        try {
            const t = JSON.stringify(value);
            localStorage.setItem(this.STORAGE_VIEW_KEY, t);
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
}
exports.default = SyncWebChangelog;
//# sourceMappingURL=WebChangeLogger.js.map