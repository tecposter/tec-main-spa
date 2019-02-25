import {deepMerge} from 'obj/deepMerge';
import {WebCore} from './WebCore';
import {CtrlPanel} from './CtrlPanel';
import {oneElem} from 'gap/web';

const _core = new WebCore();
const _setting = {};

export const bootstrap = (...args) => {
    Object.assign(_setting, deepMerge(...args));
    _core.init(_setting);
};

export const setting = () => {
    return _setting;
};

export const web_core = () => {
    return _core;
};

export const ctrl_panel = () => {
    const panel = new CtrlPanel(setting().cmd);
    const pageElem = oneElem('.page');
    if (pageElem) {
        panel.appendTo(pageElem);
    }
};
/*
import {ready} from 'gap/web';
import {deepMerge} from 'obj/deepMerge';
import {WebCore} from 'WebCore';
import {setting} from './setting/setting';
import {cmd} from './cmd/cmd';
import {localSetting} from './setting/setting.local';

const webCore = new WebCore(deepMerge(
    setting,
    localSetting,
    {pageConfig: window.PageConfig},
    {cmd}
));

ready(async () => {
    const load = window.PageConfig.load;
    if (!load) {
        return;
    }

    await (await import('./app/' + load)).default(webCore);
});

/*
import {Loader} from 'gap-front-web';

(new Loader()).onLoad(elem => {
    import('./app/' + elem.getAttribute('gap-load'));
});
*/
