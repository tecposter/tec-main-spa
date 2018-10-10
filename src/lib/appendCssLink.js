import {oneElem, createElem} from 'web-util';

export const appendCssLink = (href, attrs = {})  => {
    const link = createElem('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'screen,print';
    link.href = href;

    for (const attrName in attrs) {
        link.setAttribute(attrName, attrs[attrName]);
    }

    oneElem('head').appendChild(link);
};
