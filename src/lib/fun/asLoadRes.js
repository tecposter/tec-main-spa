import {asLoadJs} from './asLoadJs';
import {loadCss} from './loadCss';

const funs = [];
let isLocked = false;

const callfuns = async () => {
    if (isLocked) {
        return;
    }

    isLocked = true;
    while (funs.length > 0) {
        const fun = funs.shift();
        await fun();
    }
    isLocked = false;
};

const addFun = (fun) => {
    funs.push(fun);
};

export const asLoadRes = (res) => {
    return new Promise(resolve => {
        addFun(async () => {
            (res.csses || []).forEach(css => loadCss(...toArgs(css)));

            const jses = res.jses || [];
            for (const js of jses) {
                await asLoadJs(...toArgs(js));
            }
            resolve();
        });

        callfuns();
    });
};

/*
export const asLoadRes = async (res) => {
    (res.csses || []).forEach(css => loadCss(...toArgs(css)));

    const jses = res.jses || [];
    for (const js of jses) {
        await asLoadJs(...toArgs(js));
    }
};
*/

const toArgs = (arg) => {
    if (typeof arg === 'string') {
        return [arg];
    } else if (Array.isArray(arg)) {
        return arg;
    } else {
        throw new Error('The format of #1 parameter of markdown.fun.toArgs is unkown');
    }
};
