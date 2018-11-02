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
        //console.log('asSingleTon:', key, 'end');
        return container[key];
    }

    throw new Error(`cannot get async singleton of "${key}"`);
};

export const asSingleTon = async (key, obj, asFun) => {
    //console.log('asSingleTon:', key, 'start');
    if (container[key]) {
        return mustItem(key);
    }

    if (pending[key]) {
        await asPend(key);
        return mustItem(key);
    }

    pending[key] = true;

    //console.log('async singleton', key, obj, asFun);

    container[key] = await obj[asFun]();
    event.trigger(key);
    return mustItem(key);
};
