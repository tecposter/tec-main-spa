import {Request as GapRequest} from 'gap-front-request';
import {WebCache} from 'WebCache';

export class WebCore {
    constructor(setting) {
        this.setting = setting;
        this.cache = new WebCache();
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

    async asGetAccessToken(appCode) {
        const cacheKey = 'access-token-' + appCode;
        const cachedAccessToken = this.cache.get(cacheKey);
        if (cachedAccessToken) {
            return cachedAccessToken;
        }
        
        const accessByIdTokenUrl = await this.asGetUrl(appCode, 'accessByIdToken');
        const request = this.createAppRequest();
        // send cookies with request
        request.withCredentials = true;
        const remoteAccessToken = await request.postJson(accessByIdTokenUrl, {appCode});
        this.cache.set(cacheKey, remoteAccessToken);
        return remoteAccessToken;
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
