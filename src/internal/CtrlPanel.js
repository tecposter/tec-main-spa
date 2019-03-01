import {web_core} from './global';

import {Mask} from 'gap/Mask';

import {CmdManager} from 'CmdManager';

import {Pop} from './component/Pop';
import {CmdView} from './component/CmdView';
import {TecBtn} from './component/TecBtn';

export class CtrlPanel {
    constructor(cmdSetting) {
        this._mask = new Mask();
        this._cmdSetting = cmdSetting;

        this._cmdManager = this._createCmdManager(this._cmdSetting);
        this._cmdView = this._createCmdView(this._cmdManager);
        this._cmdPop = this.createPop(this._cmdView);

        this._tecBtn = this._createTecBtn(this._cmdPop);
    }

    //
    // Api
    //
    appendTo(ctn) {
        this._tecBtn.appendTo(ctn);
    }

    createPop(view, opts) {
        const pop = new Pop(this._mask, opts);
        pop.appendView(view);
        return pop;
    }

    showCmdPop() {
        this._cmdPop.show();
    }

    register(cmd, fun) {
        this._cmdManager.register(assign(cmd, fun));
    }

    hide() {
        this._mask.hideMask();
    }

    gotoHome() {
        this.gotoLocation('/');
    }

    gotoDraft() {
        this.gotoLocation('/draft');
    }

    gotoLogin() {
        this.gotoLocation(`//i.${this.getBaseHost()}/login`);
    }

    gotoLogout() {
        this.gotoLocation(`//i.${this.getBaseHost()}/logout`);
    }

    getBaseHost() {
        return web_core().setting.baseHost;
    }

    gotoLocation(url) {
        window.location = url;
    }

    //
    // Private methods
    //
    _createCmdManager(cmd) {
        const cmdManager = new CmdManager();

        cmdManager.register(
            assign(cmd.esc, () => this._mask.hide()),
            assign(cmd.cmd, () => this.showCmdPop()),
            assign(cmd.home, () => this.gotoHome())
        );
        if (web_core().isLogined()) {
            cmdManager.register(
                assign(cmd.logout, () => this.gotoLogout())
            );
        } else {
            cmdManager.register(
                assign(cmd.login, () => this.gotoLogin())
            );
        }
        return cmdManager;
    }
    /*
    const cmd = core.setting.cmd;
    cmdManager.register(
        assign(cmd.esc, () => mask.hide()),
        assign(cmd.cmd, () => cmdPop.show()),
        assign(cmd.help, () => helpPop.show()),
        assign(cmd.publish, () => showPublishPopForm(editor, publishPopForm)),
        assign(cmd.saveCommitContent, () => asSaveCommitContent(articleCtrl, editor, commit))
    );
     */

    _createCmdView(cmdManager) {
        return new CmdView({cmdManager});
    }

    _createCmdPop(mask, cmdManager) {
        const cmdView = new CmdView({cmdManager});
        const pop = new Pop(mask);
        pop.appendView(cmdView);
        return pop;
        //return new CmdPop({mask, cmdManager});
    }

    _createTecBtn(cmdPop) {
        const tecBtn = new TecBtn();
        tecBtn.onClick(() => {
            cmdPop.show();
        });
        return tecBtn;
    }
}

const assign = (obj, fun) => Object.assign(obj, {fun});
