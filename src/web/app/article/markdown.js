import {setting, ctrl_panel} from 'global';
import {oneElem, createElem} from 'gap/web';
import {Editor} from 'markdown/Editor';
import {ArticleCtrl} from './ctrl/ArticleCtrl';
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

    
    const cmd = setting().cmd;
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
        {key: 'pdf', desc: 'PDF'},
        () => {
            const mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
            const title = 'test';
            const divId = 'editor-preview';

            mywindow.document.write(`<html><head><title>${title}</title>`);
            mywindow.document.write(`
                <link rel="stylesheet" href="//static.tecposter.cn/ui/dev/css/main.css">
                <link type="text/css" rel="stylesheet" media="screen,print" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">
                <link type="text/css" rel="stylesheet" media="screen,print" href="https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css" integrity="sha384-9eLZqc9ds8eNjO3TmqPeYcDj8n+Qfa4nuSiGYa6DjLNcv9BtN69ZIulL9+8CqC9Y" crossorigin="anonymous">
            `);
            mywindow.document.write('</head><body >');
            mywindow.document.write(document.getElementById(divId).innerHTML);
            mywindow.document.write('</body></html>');

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/

            mywindow.print();
            //mywindow.close();

            return true;
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
