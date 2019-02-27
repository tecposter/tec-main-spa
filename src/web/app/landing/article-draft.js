import {ctrl_panel} from 'global';
import {listCtrl} from 'list';
import {oneElem} from 'gap/web';

export default async () => {
    const ctrlPanel = ctrl_panel();
    listCtrl(ctrlPanel, oneElem('.article-list'));
};
