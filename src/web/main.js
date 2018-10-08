import {ready} from 'gap-front-web';
import {setting} from './setting/setting';
import {localSetting} from './setting/setting.local';
import {WebCore} from 'WebCore';
import {deepMerge} from 'deepMerge';

const webCore = new WebCore(
    deepMerge(
        setting,
        localSetting,
        {pageConfig: window.PageConfig}
    )
);

ready(async () => {
    await (await import('./app/' + window.PageConfig.load)).default(webCore);
});

/*
import {Loader} from 'gap-front-web';

(new Loader()).onLoad(elem => {
    import('./app/' + elem.getAttribute('gap-load'));
});
*/
