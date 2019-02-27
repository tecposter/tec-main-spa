import {setting, ctrl_panel} from 'global';
import {oneElem, createElem} from 'gap/web';
import {Editor} from 'markdown/Editor';
import {ArticleCtrl} from './ctrl/ArticleCtrl';
import {PublishForm} from './form/PublishForm';

export default async () => {
    const pageElem = oneElem('.page');
    const ctnElem = createElem('div');
    pageElem.appendChild(ctnElem);

    const commit = setting().pageConfig.commit;

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
