import {GapEvent} from 'gap/GapEvent';

const container = {};
const pending = {};
const event = new GapEvent();

const asPend = (key) => {
    return new Promise(resolve => {
        event.on(key, () => resolve(true));
    });
};

const mustItem = (key) => {
    if (container[key]) {
        //console.log('asOnce:', key, 'end');
        return container[key];
    }

    throw new Error(`cannot get async singleton of "${key}"`);
};

export const asOnce = async (key, asFun) => {
    //console.log('asOnce:', key, 'start');
    if (container[key]) {
        return mustItem(key);
    }

    if (pending[key]) {
        await asPend(key);
        return mustItem(key);
    }

    //console.log('async singleton', key, asFun);
    pending[key] = true;
    container[key] = await asFun();
    event.trigger(key);
    return mustItem(key);
};
