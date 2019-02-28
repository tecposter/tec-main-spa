import {setting, web_core, ctrl_panel} from 'global';
import {listCtrl} from 'list';
import {oneElem} from 'gap/web';

export default async () => {
    const ctrlPanel = ctrl_panel();
    const cmd = setting().cmd;

    listCtrl(ctrlPanel, oneElem('.article-list'));

    if (web_core().isLogined()) {
        ctrlPanel.register(cmd.draft, () => ctrlPanel.gotoDraft());
        ctrlPanel.register(cmd.createArticle, () => createArticle());
    }
};

const createArticle = () => {
    window.location = '/article-req-creating';
};
