import {Request as GapRequest} from 'gap/Request';
import {SessionStorage} from 'storage/SessionStorage';

const RouteDict = {
    identityAccess: 'identity-access',
    refreshIdToken: 'refresh-id-token',
    refreshAccessToken: 'refresh-access-token'
};

const AccessTokenTtl = 3 * 60 * 60 * 1000; // 3 hour
const IdTokenTtl = 12 * 60 * 60 * 1000; // 12 hour
const AccessTokenCachePre = 'access-token-';
const DefaultAppCode = 'main';

export class WebCore {
    constructor() {
        this.cache = new SessionStorage();
    }

    init(setting) {
        this.setting = setting;
        this.asAutoRefreshIdToken();
    }

    isLogined() {
        return document.cookie.split(';').filter((item) => item.trim().startsWith('logined=true')).length === 1;
    }

    async asAutoRefreshIdToken() {
        const idTokenRefreshedKey = 'id-token-refreshed';
        const idTokenRefreshed = this.cache.get(idTokenRefreshedKey);

        if (!idTokenRefreshed) {
            if (this.isLogined()) {
                const refreshed = (new Date()).getTime();
                this.cache.set(idTokenRefreshedKey, refreshed);
            }
            return;
        }
        const now = (new Date()).getTime();
        if ((now - idTokenRefreshed) > IdTokenTtl) {
            if (await this.asRefreshIdToken()) {
                this.cache.set(idTokenRefreshedKey, now);
            }
        }
    }

    async asAutoRefreshAccessToken(appCode) {
        const refreshedKey = 'access-token-refreshed-' + appCode;
        const cacheKey = AccessTokenCachePre + appCode;
        const refreshed = this.cache.get(refreshedKey);

        if (!refreshed) {
            if (this.cache.get(cacheKey)) {
                this.cache.set(refreshedKey, (new Date()).getTime());
            }
            return;
        }

        const now = (new Date()).getTime();
        if ((now - refreshed) > AccessTokenTtl) {
            if (await this.asRefreshAccessToken(appCode)) {
                this.cache.set(refreshed, now);
            }
        }
    }

    async asRefreshIdToken() {
        const url = await this.asGetUrl(DefaultAppCode, RouteDict.refreshIdToken);
        const request = this.createAppRequest();
        request.withCredentials = true;
        try {
            await request.postJson(url);
            return true;
        } catch(e) {
            throw e;
        }
    }

    async asRefreshAccessToken(appCode) {
        const cacheKey = AccessTokenCachePre + appCode;
        const cachedAccessToken = this.cache.get(cacheKey);
        if (!cachedAccessToken) {
            throw new Error('cannot get cached access token');
        }

        const url = await this.asGetUrl(appCode, RouteDict.refreshAccessToken);
        const request = this.createAppRequest();
        request.withCredentials = true;
        request.addHeader('Authorization', 'Bearer ' + cachedAccessToken.token);
        try {
            const remoteAccessToken = await request.postJson(url, {
                refresh: cachedAccessToken.refresh
            });
            this.cache.set(cacheKey, remoteAccessToken);
            return true;
        } catch(e) {
            this.cache.remove(cacheKey);
            throw e;
        }
    }


    async asGetAccessToken(appCode) {
        await this.asAutoRefreshIdToken();
        await this.asAutoRefreshAccessToken(appCode);

        const cacheKey = AccessTokenCachePre + appCode;
        const cachedAccessToken = this.cache.get(cacheKey);
        if (cachedAccessToken) {
            return cachedAccessToken;
        }
        
        const identityAccessUrl = await this.asGetUrl(appCode, RouteDict.identityAccess);
        const request = this.createAppRequest();
        // send cookies with request
        request.withCredentials = true;
        const remoteAccessToken = await request.postJson(identityAccessUrl);
        this.cache.set(cacheKey, remoteAccessToken);
        return remoteAccessToken;
    }


    async apiPostJson(appCode, routeName, params) {

        const url = await this.asGetUrl(appCode, routeName);
        const accessToken = await this.asGetAccessToken(appCode);
        if (!accessToken) {
            throw new Error('cannot get accessToken:' + accessToken);
        }

        // new instance every time ?
        const request = this.createAppRequest();
        request.addHeader('Authorization', 'Bearer ' + accessToken.token);
        return request.postJson(url, params);
    }

    async asGetUrl(appCode, routeName) {
        const appSetting = await this.asGetAppSetting(appCode);
        return this.generateUrl(appSetting, routeName);
    }

    async asGetAppSetting(appCode) {
        const cacheKey = 'app-' + appCode;
        const cachedAppSetting = this.cache.get(cacheKey);
        if (cachedAppSetting) {
            return cachedAppSetting;
        }

        const appSetting = this.setting.app[appCode];
        if (!appSetting) {
            throw new Error('cannot find appSetting: ' + appCode);
        }

        const apiIndexUrl = this.generateUrl(appSetting, 'apiIndex');
        const appRequest = this.createAppRequest();
        const remoteAppSetting = await appRequest.postJson(apiIndexUrl);

        if (!remoteAppSetting) {
            throw new Error('cannot find app: ' + appCode);
        }
        this.cache.set(cacheKey, remoteAppSetting);
        return remoteAppSetting;
    }

    createAppRequest() {
        const request = new GapRequest();
        request.addHeader('Accept', 'application/json');
        return request;
    }

    generateUrl(appSetting, routeName) {
        const route = appSetting.route[routeName];
        if (!route) {
            throw new Error('cannot find routeName: ' + routeName);
        }

        const siteSetting = appSetting.site[route.site];
        if (!siteSetting) {
            throw new Error('cannot find site ' + route.site);
        }

        const baseUrl = siteSetting.baseUrl;
        if (!baseUrl) {
            throw new Error('connt find site: ' + route.site);
        }

        return (siteSetting.protocol || 'http')
            + '://'
            + baseUrl
            + route.pattern;
    }
}
