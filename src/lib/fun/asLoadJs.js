import {oneElem, createElem} from 'gap/web';

const createScriptElem = (src, attrs = {}) => {
    if (typeof(src) !== 'string') {
        throw new Error('must be string');
    }
    const elem = createElem('script');
    elem.type = 'text/javascript';
    elem.src = src;

    for (const attrName in attrs) {
        elem.setAttribute(attrName, attrs[attrName]);
    }

    return elem;
};

export const asLoadJs = (src, attrs = {}) => {
    //console.log('asLoadJs: ', src, 'start');

    return new Promise(resolve => {
        const head = oneElem('head');
        const scriptElem = (src instanceof HTMLScriptElement) ? src : createScriptElem(src, attrs);
        head.appendChild(scriptElem);
        if (scriptElem.src) {
            scriptElem.on('load', () => {
                //console.log('asLoadJs: ', src, 'end');
                resolve(true);
            });
        } else {
            //console.log('asLoadJs: ', src, 'end');
            resolve(true);
        }
    });
};
