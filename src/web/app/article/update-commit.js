import {Mask} from 'gap/Mask';
import {oneElem, createElem} from 'gap/web';

import {Editor} from 'markdown/Editor';
import {CmdManager} from 'CmdManager';

import {TecBtn} from 'component/TecBtn';
import {HelpPop} from 'component/HelpPop';
import {CmdPop} from 'component/CmdPop';

import {PublishPopForm} from './popForm/PublishPopForm';
import {ArticleCtrl} from './ctrl/ArticleCtrl';

export default async core => {
    const pageElem = oneElem('.page');
    const ctnElem = createCtnElem(pageElem);

    const commit = core.setting.pageConfig.commit;
    const editor = createEditor(ctnElem, commit.content);

    const cmdManager = new CmdManager();
    const mask = new Mask();
    const helpPop = new HelpPop({mask});
    const cmdPop = new CmdPop({mask, cmdManager});
    const publishPopForm = new PublishPopForm({mask});
    const articleCtrl = new ArticleCtrl(core);

    createTecBtn(pageElem, cmdPop);

    publishPopForm.onShow(() => {
        publishPopForm.update({
            title: editor.getTitle(),
            slug: commit.slug,
            code: commit.code
        });
    });

    publishPopForm.onSubmit((slug, isPublic) => {
        publishArticle(articleCtrl, commit.code, slug, isPublic);
    });

    const cmd = core.setting.cmd;
    cmdManager.register(
        assign(cmd.esc, () => mask.hide()),
        assign(cmd.cmd, () => cmdPop.show()),
        assign(cmd.help, () => helpPop.show()),
        assign(cmd.publish, () => showPublishPopForm(editor, publishPopForm)),
        assign(cmd.saveCommitContent, () => asSaveCommitContent(articleCtrl, editor, commit))
    );
};

/*
const RouteDict = {
    articleUpdateCommitContent: 'article-update-commit-content'
};
*/

const asSaveCommitContent = async (articleCtrl, editor, commit) => {
    const content = editor.getContent();
    const commitCode = commit.code;
    await articleCtrl.asSaveCommitContent(commitCode, content);
    document.title = editor.getTitle();
    editor.saved();
};

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

const publishArticle = async (articleCtrl, code, slug, isPublic) => {
    await articleCtrl.asPublish(code, slug, isPublic);
    gotoArticlePage(slug);
};

const createTecBtn = (pageElem, cmdPop) => {
    const tecBtn = new TecBtn();
    tecBtn.onClick(() => cmdPop.show());
    tecBtn.appendTo(pageElem);
    return tecBtn;
};

const showPublishPopForm = (editor, publishPopForm) => {
    if (editor.isChanged()) {
        alert('Please save content first');
        return;
    }
    publishPopForm.show();
};

const gotoArticlePage = (slug) => {
    window.location = '/article/' + slug;
};

const assign = (obj, fun) => Object.assign(obj, {fun});
