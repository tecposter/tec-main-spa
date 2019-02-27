import {setting, web_core, ctrl_panel} from 'global';
import {oneElem} from 'gap/web';

export default async () => {
    const ctrlPanel = ctrl_panel();
    const cmd = setting().cmd;

    if (web_core().isLogined()) {
        ctrlPanel.register(cmd.draft, () => ctrlPanel.gotoDraft());
    }
    ctrlPanel.register(cmd.next, () => nextItem());
    ctrlPanel.register(cmd.prev, () => prevItem());
    ctrlPanel.register(cmd.select, () => selectItem());

    oneElem('.article-list .item').addClass('selected');
};

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
    return oneElem('.article-list .item.selected');
};
