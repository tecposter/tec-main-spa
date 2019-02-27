import {setting, web_core, ctrl_panel} from 'global';

export default async () => {
    const ctrlPanel = ctrl_panel();
    if (web_core().isLogined()) {
        const cmd = setting().cmd;
        ctrlPanel.register(cmd.draft, () => {
            ctrlPanel.gotoDraft();
        });
    }
};
