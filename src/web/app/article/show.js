import {oneElem} from 'gap/web';
import {Parser} from 'markdown/Parser';
import {ctrl_panel, setting} from 'global';

export default async () => {
    const ctrlPanel = ctrl_panel();

    const parser = new Parser();
    parser.asRenderElem(oneElem('.article-detail')); 

    const cmd = setting().cmd;
    const slug = setting().pageConfig.slug;
    ctrlPanel.register(cmd.editArticle, () => gotoReqUpdate(slug));
};

const gotoReqUpdate = (slug) => {
    window.location = '/article-req-updating/' + slug;
};
