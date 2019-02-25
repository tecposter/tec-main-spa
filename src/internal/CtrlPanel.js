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

    createPop(view) {
        const pop = new Pop(this._mask);
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

    //
    // Private methods
    //
    _createCmdManager(cmd) {
        const cmdManager = new CmdManager();

        cmdManager.register(
            assign(cmd.esc, () => this._mask.hide()),
            assign(cmd.cmd, () => this.showCmdPop())
        );
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
