import {View} from 'gap/View';
import 'gap/component/zselect';

// ${cmd.key} [${cmd.shortKeys}]: ${cmd.desc || ''}

const ZselectOpts = {
    required: 'required',
    name: 'cmd',
    placeholder: 'ctrl-j: next; ctrl-k: prev; enter: select', // todo
    pattern: {
        content: '#{desc} - #{key} (#{shortKeys})',
        selected: '',
        value: '#{key}'
    }
};

export class CmdView extends View {
    template() {
        return this.html`
        <form class="cmd" method="post" action="javascript:;"
            on-submit=${() => this.onSubmit()}
            >
            <div class="form-content">
                <label>
                    <zselect
                        props=${ZselectOpts}
                        ref=${zselect => this.initZselect(zselect)}
                    ></zselect>
                </label>
            </div><!-- .form-content -->
        </form>
        `;
    }
    /*
                <div class="cmd-list">
                    ${this.geneCmdListTpl()}
                </div>
     */

    initZselect(zselect) {

        zselect.onQuery(query => {
            const cmds = this.getCmds();
            const cmdArr = Object.values(cmds);

            query = query.replace(/\\/g, '\\\\').toLowerCase();

            return cmdArr.filter(item => {
                return item.key.toLowerCase().match(query)
                    || item.shortKeys.toLowerCase().match(query)
                    || item.desc.toLowerCase().match(query);
            });
        });
        // todo
        //zselect.update({placeholder: ZselectOpts.placeholder});
        zselect.onSelect(cmd => this.getCmdManager().trigger(cmd.key));
        this.zselect = zselect;
    }

    focus() {
        //super.show();
        this.zselect.focus();
        this.zselect.clear();
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

    getCmdManager() {
        return this.props.cmdManager;
    }

    /*
    onSubmit() {
        this.props.cmdManager.trigger(this.input.value);
    }

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
