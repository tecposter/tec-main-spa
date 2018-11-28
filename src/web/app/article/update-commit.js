import {Mask} from 'gap/Mask';
import {oneElem, createElem} from 'gap/web';

import {Editor} from 'markdown/Editor';
import {CmdManager} from 'CmdManager';

import {TecBtn} from 'component/TecBtn';
import {HelpPop} from 'component/HelpPop';
import {CmdPop} from 'component/CmdPop';

import {PublishPopForm} from './popForm/PublishPopForm';

/*
const RouteDict = {
    articleUpdateCommitContent: 'article-update-commit-content'
};
*/

const createEditor = (ctnElem, content) => {
    const editor = new Editor(ctnElem, content);

    window.on('beforeunload', evt => {
        if (!editor.isChanged()) {
            return;
        }

        evt.stop();
        evt.cancel();
        (evt || window.event).returnValue = null;
        return null;
    });

    editor.onChange(() => {
        document.title = '* ' + editor.getTitle();
    });

    return editor;
};

const createCtnElem = (pageElem) => {
    const elem = createElem('div');
    pageElem.appendChild(elem);
    return elem;
};

const createPublishPopForm = (mask, editor, commit) => {
    const publishPopForm = new PublishPopForm({mask});
    publishPopForm.onShow(() => {
        publishPopForm.update({
            title: editor.getTitle(),
            slug: commit.slug,
            code: commit.code
        });
    });
    return publishPopForm;
};

const createTecBtn = (pageElem, cmdPop) => {
    const tecBtn = new TecBtn();
    tecBtn.onClick(() => cmdPop.show());
    tecBtn.appendTo(pageElem);
    return tecBtn;
};

const showPublishPopForm = (editor, publishPopForm) => {
    if (editor.isChanged) {
        alert('Please save content first');
        return;
    }
    publishPopForm.show();
};


const assign = (obj, fun) => Object.assign(obj, {fun});

export default async core => {
    const pageElem = oneElem('.page');
    const ctnElem = createCtnElem(pageElem);

    const commit = core.setting.pageConfig.commit;
    const editor = createEditor(ctnElem, commit.content);

    const cmdManager = new CmdManager();
    const mask = new Mask();
    const helpPop = new HelpPop({mask});
    const cmdPop = new CmdPop({mask, cmdManager});
    const publishPopForm = createPublishPopForm(mask, editor, commit);
    createTecBtn(pageElem, cmdPop);


    const cmd = core.setting.cmd;
    cmdManager.register(
        assign(cmd.esc, () => mask.hide()),
        assign(cmd.cmd, () => cmdPop.show()),
        assign(cmd.help, () => helpPop.show()),
        assign(cmd.publish, () => showPublishPopForm(editor, publishPopForm))
    );
};
