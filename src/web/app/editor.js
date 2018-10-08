import {Request} from 'gap-front-request';

(async () => {
    const request = new Request();
    request.addHeader('Accept', 'application/json');
    //request.addHeader('Authorization', 'Bearer ' + accessToken.token);
    request.withCredentials = true;
    const url = '//api.tecposter.cn/access-by-id-token';
    const accessToken = await request.postJson(url, {appCode: 'main'});
    //console.log(accessToken);

    const res = await request.postJson('//api.tecposter.cn');
    //console.log(res);
    return {accessToken, res};
})();
