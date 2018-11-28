import {Pop} from 'gap/Pop';

export class CmdPop extends Pop {
    template() {
        return this.html`
        <form method="post" action="javascript:;"
            on-submit=${() => this.onSubmit()}
            >
            <div class="form-content">
                <label>
                    <input type="text" name="cmd" value="" ref=${input => this.input = input}>
                </label>
                <div class="cmd-list">
                    ${this.geneCmdListTpl()}
                </div>
            </div><!-- .form-content -->
        </form>
        `;
    }

    show() {
        super.show();
        this.input.value = '';
        this.input.focus();
    }

    onSubmit() {
        this.props.cmdManager.trigger(this.input.value);
    }

    geneCmdListTpl() {
        const cmds = this.props.cmdManager.cmds;
        return `
        <ul>
        ${Object.keys(cmds).map(cmdKey => this.geneCmdItemHtml(cmds[cmdKey])).join('')}
        </ul>
        `;
    }

    geneCmdItemHtml(cmd) {
        return `
            <li>
            ${cmd.key} [${cmd.shortKeys}]: ${cmd.desc || ''}
            </li>
        `;
    }

    /*
    geneCmdListTpl() {
        const cmds = this.props.cmdManager.cmds;
        return this.html`
        ${Object.keys(cmds).map(mode => this.geneCmdSetTpl(mode, cmds[mode]))}
        `;
    }

    geneCmdSetTpl(mode, cmdSet) {
        return this.html`
        <div class="mode">
            <h3 class="title small">${mode} mode</h3>
            <ul>
            ${Object.keys(cmdSet).map(cmd => this.geneCmdItemHtml(cmd, cmdSet[cmd]))}
            </ul>
        </div>
        `;
    }

    geneCmdItemHtml(cmd, cmdObj) {
        return `
        <li>
            ${cmd} [${cmdObj.shortKeys.join(', ')}]:
            ${cmdObj.desc || ''}
        </li>
        `;
    }
    */
}
