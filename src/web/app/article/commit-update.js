import {MonacoEditor} from 'MonacoEditor';
import {CtrlPanel} from 'CtrlPanel';
import {CmdManager} from 'CmdManager';
import {Mask} from 'Mask';
import {Helper} from 'Helper';
import {oneElem} from 'web-util';

export default async core => {
    const pageElem = oneElem('.page');
    const editor = new MonacoEditor(core.setting.pageConfig.commitDto.content);
    const ctrlPanel = new CtrlPanel({
        menuItems: [
            {title: 'item1'},
            {title: 'item2'}
        ]
    });
    const mask = new Mask();
    const helper = new Helper(mask);

    editor.appendTo(pageElem);
    ctrlPanel.appendTo(pageElem);

    const cmdManager = new CmdManager();
    cmdManager.register(
        CmdManager.Mode.normal, 'update: Update article commit', 'ctrl-s',
        () => updateArticleCommit(core, editor)
    );

    cmdManager.register(
        CmdManager.Mode.normal, 'help: Show help', 'ctrl-shift-/',
        () => helper.show()
    );

    cmdManager.register(
        [CmdManager.Mode.normal, CmdManager.Mode.edit], 'esc', 'esc',
        () => mask.hide()
    );
};

const updateArticleCommit = async (core, editor) => {
    const commitDto = core.setting.pageConfig.commitDto;
    commitDto.content = editor.getContent();
    await core.apiPostJson('main', 'updateArticleCommit', commitDto);
    editor.saved();
};
