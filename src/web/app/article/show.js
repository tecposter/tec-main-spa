import {oneElem} from 'gap/web';
import {Parser} from 'markdown/Parser';
import {ctrl_panel} from 'global';

export default async () => {
    ctrl_panel();

    const parser = new Parser();
    parser.asRenderElem(oneElem('.article-detail')); 
};
