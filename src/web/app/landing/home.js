import {oneElem} from 'gap/web';
import {ctrl_panel} from 'global';

export default async () => {
    const ctrlPanel = ctrl_panel();
    ctrlPanel.appendTo(oneElem('.page'));
};
