import {oneElem} from 'gap/web';
import {Parser} from 'markdown/Parser';
import {web_core, ctrl_panel, setting} from 'global';

export default async () => {
    const ctrlPanel = ctrl_panel();

    const parser = new Parser();
    parser.asRenderElem(oneElem('.article-detail')); 

    if (web_core().isLogined()) {
        const cmd = setting().cmd;
        const slug = setting().pageConfig.slug;
        ctrlPanel.register(cmd.editArticle, () => gotoReqUpdate(slug));
    }
};

const gotoReqUpdate = (slug) => {
    window.location = '/article-req-updating/' + slug;
};
