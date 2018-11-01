const prefix = '@tec-';

export class SessionStorage {
    get(key) {
        const cacheKey = this.getCacheKey(key);
        const res = window.sessionStorage.getItem(cacheKey);
        if (!res) {
            return null;
        }
        return JSON.parse(res);
    }

    set(key, obj) {
        window.sessionStorage.setItem(
            this.getCacheKey(key),
            JSON.stringify(obj)
        );
    }

    remove(key) {
        window.sessionStorage.removeItem(
            this.getCacheKey(key)
        );
    }

    clear() {
        window.sessionStorage.clear();
    }

    getCacheKey(key) {
        return prefix + key;
    }
}
