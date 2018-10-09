import {MonacoEditor} from 'MonacoEditor';
import {CtrlPanel} from 'CtrlPanel';
//import {CmdManager} from 'CmdManager';
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

    editor.appendTo(pageElem);
    ctrlPanel.appendTo(pageElem);

    /*
    const cmdManager = new CmdManager();
    cmdManager.register(
        CmdManager.Mode.normal,
        'update',
        'Update article commit',
        () => updateArticleCommit(editor),
        ['meta-s', 'ctrl-s', 'alt-s']
    );
    */
};

/*
const updateArticleCommit = (editor) => {
    console.log(editor.getContent());
};
*/
