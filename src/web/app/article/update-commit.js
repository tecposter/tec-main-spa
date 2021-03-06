import {setting, ctrl_panel} from 'global';
import {oneElem, createElem} from 'gap/web';
import {Editor} from 'markdown/Editor';
import {ArticleCtrl} from './ctrl/ArticleCtrl';
import {PublishForm} from './form/PublishForm';
import {asMonaco} from 'monaco/asMonaco';
import {DiffView} from './view/DiffView';

export default async () => {
    const pageElem = oneElem('.page');
    const ctnElem = createElem('div');
    pageElem.appendChild(ctnElem);

    const commit = setting().pageConfig.commit;
    const localOri = commit.content;
    const editor = createEditor(ctnElem, commit.content);
    const ctrlPanel = ctrl_panel();
    const articleCtrl = new ArticleCtrl();

    const publishForm = new PublishForm();
    const publishPop = ctrlPanel.createPop(publishForm);
    publishPop.onShow(() => {
        publishForm.update({
            title: editor.getTitle(),
            slug: commit.slug,
            code: commit.code
        });
    });
    publishForm.onSubmit(async (slug, isPublic) => {
        await articleCtrl.asPublish(commit.code, slug, isPublic);
        window.location = '/article/' + slug;
    });
    
    const cmd = setting().cmd;
    ctrlPanel.register(cmd.publish, () => publishPop.show());
    ctrlPanel.register(cmd.saveCommitContent, async () => {
        await articleCtrl.asSaveCommitContent(
            commit.code,
            editor.getContent()
        );
        document.title = editor.getTitle();
        editor.saved();
        ctrlPanel.hide();
    });
    ctrlPanel.register(cmd.draft, () => ctrlPanel.gotoDraft());
    ctrlPanel.register(cmd.showArticle, () => gotoShowArticle(commit.slug));

    const codeModel = await editor.asGetCodeModel();
    const monaco = await asMonaco();
    const diffView = new DiffView(monaco, codeModel);
    const diffPop = ctrlPanel.createPop(diffView, {type: 'broad'});
    ctrlPanel.register(
        cmd.diff,
        () => {
            diffPop.show();
            diffView.showDiff();
            //diffView.diff(localOri);
        }
    );
    diffView.onChange(async key => {
        if (key === 'remote-draft') {
            diffView.diff(localOri);
        } else if (key === 'released-article') {
            diffView.diff(await asGetReleasedContent());
        }
    });

    let releasedContent = null;
    const asGetReleasedContent = async () => {
        if (releasedContent !== null) {
            return releasedContent;
        }
        releasedContent = await articleCtrl.asFetchReleasedContent(commit.slug);
        return releasedContent;
    };

    ctrlPanel.register(
        {key: 'deleteDraft', desc: 'Delete Draft'},
        () => {
            window.location = '/article-delete-draft/' + commit.slug;
            return;
        }
    );
};

const gotoShowArticle = (slug) => {
    window.location = '/article/' + slug;
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
