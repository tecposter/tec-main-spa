import {MonacoEditor} from 'MonacoEditor';
import {CtrlPanel} from 'CtrlPanel';
import {CmdManager} from 'CmdManager';
import {CmdDialog} from 'CmdDialog';
import {Mask} from 'Mask';
import {Helper} from 'Helper';
import {oneElem} from 'web-util';

import {PublishPopForm} from './popForm/PublishPopForm';

export default async core => {
    const pageElem = oneElem('.page');
    const commitDto = core.setting.pageConfig.commitDto;
    const articleDto = await asFetchArticleById(core, commitDto.articleId);
    const editor = new MonacoEditor(commitDto.content);
    const ctrlPanel = new CtrlPanel({
        menuItems: [
            {title: 'item1'},
            {title: 'item2'}
        ]
    });
    const mask = new Mask();
    const helper = new Helper({mask});
    const cmdManager = new CmdManager();
    const cmdDialog = new CmdDialog({mask, cmdManager});
    const publishPopForm = new PublishPopForm({mask});

    publishPopForm.on('show', () => {
        publishPopForm.update({
            title: editor.getTitle(),
            zcode: articleDto.zcode,
            articleId: commitDto.articleId,
            commitId: commitDto.commitId
        });
    });

    publishPopForm.on('submit', async (zcode, isPublic) => {
        const articleId = commitDto.articleId;
        const commitId = commitDto.commitId;

        const res = await asPublishArticleCommit(core, articleId, commitId, zcode, isPublic);
        if (res && res.url) {
            window.location.href = res.url;
        }
    });
    //const publishPopForm = createPublishPopForm(mask, editor, commitDto, articleDto);

    editor.appendTo(pageElem);
    ctrlPanel.appendTo(pageElem);

    cmdManager.setMode(CmdManager.Mode.edit);
    cmdManager.register(
        'help: Show help', 'ctrl-shift-/',
        () => helper.show()
    );

    cmdManager.register(
        'update: Update article commit', 'ctrl-s',
        () => asUpdateArticleCommit(core, editor, commitDto)
    );

    cmdManager.register(
        'esc', 'esc',
        () => mask.hide()
    );

    cmdManager.register(
        'cmd: Show command dialog',
        'ctrl-;',
        () => cmdDialog.show()
    );

    cmdManager.register(
        'publish: Publish article',
        'ctrl-shift-p',
        ()  => {
            if (editor.isChanged) {
                alert('Please save content first');
                return;
            }
            publishPopForm.show();
        }
    );
};

const asUpdateArticleCommit = async (core, editor, commitDto) => {
    commitDto.content = editor.getContent();
    await core.apiPostJson('main', 'updateArticleCommit', commitDto);
    editor.saved();
};

const asPublishArticleCommit = async (core, articleId, commitId, zcode, isPublic) => {
    const res = await core.apiPostJson('main', 'publishArticleCommit', {
        articleId,
        zcode,
        commitId,
        isPublic
    });
    return res;
};

const asFetchArticleById = async (core, articleId) => {
    const articleDto = await core.apiPostJson('main', 'fetchArticleById', {articleId});
    return articleDto;
};

/*
const createPublishPopForm = (mask, editor, commitDto, articleDto) => {
    const popForm = new PublishPopForm({mask, editor, commitDto, articleDto});
    return popForm;
};
*/
