import {setting} from 'global';

export const listCtrl = (ctrlPanel, listElem) => {
    const nextItem = () => {
        const current = currentItem();
        const next = current.nextElementSibling;
        if (next) {
            current.removeClass('selected');
            next.addClass('selected');
        }
    };

    const prevItem = () => {
        const current = currentItem();
        const prev = current.previousElementSibling;
        if (prev) {
            current.removeClass('selected');
            prev.addClass('selected');
        }
    };

    const selectItem = () => {
        const current = currentItem();
        current.oneElem('a').click();
    };

    const currentItem = () => {
        return listElem.oneElem('.item.selected');
    };

    const cmd = setting().cmd;

    ctrlPanel.register(cmd.next, () => nextItem());
    ctrlPanel.register(cmd.prev, () => prevItem());
    ctrlPanel.register(cmd.select, () => selectItem());

    listElem.oneElem('.item').addClass('selected');
};

