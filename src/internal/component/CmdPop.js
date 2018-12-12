import {Pop} from 'gap/Pop';
import 'gap/component/zselect';

// ${cmd.key} [${cmd.shortKeys}]: ${cmd.desc || ''}

const ZselectOpts = {
    required: 'required',
    name: 'cmd',
    pattern: {
        content: '#{key} [#{shortKeys}]: #{desc}',
        selected: '',
        value: '#{key}'
    }
};

export class CmdPop extends Pop {
    template() {
        return this.html`
        <form method="post" action="javascript:;"
            on-submit=${() => this.onSubmit()}
            >
            <div class="form-content">
                <label>
                    <zselect
                        props=${ZselectOpts}
                        ref=${zselect => this.initZselect(zselect)}
                    ></zselect>
                </label>
                <div class="cmd-list">
                    ${this.geneCmdListTpl()}
                </div>
            </div><!-- .form-content -->
        </form>
        `;
    }

    initZselect(zselect) {
        const cmds = this.getCmds();
        const cmdArr = Object.values(cmds);
        zselect.onQuery(query => {
            return cmdArr.filter(item => {
                return item.key.match(query)
                    || item.shortKeys.match(query)
                    || item.desc.match(query);
            });
        });
        this.zselect = zselect;
    }

    show() {
        super.show();
        this.zselect.focus();
    }

    onSubmit() {
        this.props.cmdManager.trigger(this.input.value);
    }

    geneCmdListTpl() {
        const cmds = this.getCmds();
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

    getCmds() {
        return this.props.cmdManager.cmds;
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
