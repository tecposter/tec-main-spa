export const setting = {
    localeKey: 'zh-cn',
    //basePath: '/web',
    mainAppCode: 'main',
    currentAppCode: 'main',
    app: {
        main: {
            appCode: 'main',
            appId: 'tec-main',
            site: {
                api: {
                    baseUrl: 'api.tecposter.cn',
                    protocol: 'https'
                }
            },
            route: {
                apiIndex: {
                    access: 'public',
                    method: 'POST',
                    name: 'apiIndex',
                    pattern: '/',
                    site: 'api'
                },
                accessByIdToken: {
                    access: 'public',
                    method: 'POST',
                    name: 'accessByIdToken',
                    pattern: '/access-by-id-token',
                    site: 'api'
                }
            }
        }
    }
};
