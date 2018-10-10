import {oneElem, createElem} from 'web-util';

export const asLoadJs = (src) => {
    const createScriptElem = (src) => {
        if (typeof(src) !== 'string') {
            throw new Error('must be string');
        }
        const elem = createElem('script');
        elem.type = 'text/javascript';
        elem.src = src;
        return elem;
    };

    const head = oneElem('head');
    return new Promise((resolve) => {
        const scriptElem = (src instanceof HTMLScriptElement) ? src : createScriptElem(src);
        head.appendChild(scriptElem);
        if (scriptElem.src) {
            scriptElem.on('load', () => {
                resolve(true);
            });
        } else {
            resolve(true);
        }
    });
};
