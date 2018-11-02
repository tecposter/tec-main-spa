import {Mask} from 'gap/Mask';
import {oneElem, createElem} from 'gap/web';

import {Editor} from 'markdown/Editor';
import {CmdManager} from 'CmdManager';

import {Helper} from 'component/Helper';
import {CtrlPanel} from 'component/CtrlPanel';
import {CmdDialog} from 'component/CmdDialog';

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

export default async core => {
    const pageElem = oneElem('.page');
    const ctnElem = createElem('div');
    pageElem.appendChild(ctnElem);

    const commit = core.setting.pageConfig.commit;
    const editor = createEditor(ctnElem, commit.content);

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
            slug: commit.slug,
            code: commit.code
        });
    });

    /*
    publishPopForm.on('submit', async (slug, isPublic) => {
        const res = await asArticlePublish(core, commit.code, slug, isPublic);
        if (res && res.url) {
            window.location.href = res.url;
        }
    });
    */
    //const publishPopForm = createPublishPopForm(mask, editor, commit, articleDto);

    //editor.appendTo(pageElem);
    ctrlPanel.appendTo(pageElem);

    cmdManager.setMode(CmdManager.Mode.edit);
    cmdManager.register(
        'help: Show help', 'ctrl-shift-/',
        () => helper.show()
    );

    /*
    cmdManager.register(
        'update: Update article commit', 'ctrl-s',
        () => asArticleUpdateCommitContent(core, editor, commit)
    );
    */

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

/*
const asArticleUpdateCommitContent = async (core, editor, code) => {
    //commit.content = editor.getContent();
    await core.apiPostJson(
        'main',
        RouteDict.articleUpdateCommitContent,
        {code: code, content: editor.getContent}
    );
    editor.saved();
};

const asArticlePublish = async (core, articleId, commitId, zcode, isPublic) => {
    const res = await core.apiPostJson('main', 'publishArticleCommit', {
        articleId,
        zcode,
        commitId,
        isPublic
    });
    return res;
};
*/

/*
const asFetchArticleById = async (core, articleId) => {
    const articleDto = await core.apiPostJson('main', 'fetchArticleById', {articleId});
    return articleDto;
};

const createPublishPopForm = (mask, editor, commit, articleDto) => {
    const popForm = new PublishPopForm({mask, editor, commit, articleDto});
    return popForm;
};
*/
