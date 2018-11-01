import {oneElem} from 'gap/web';
import {Parser} from 'markdown/Parser';

export default async () => {
    const parser = new Parser();
    parser.asRenderElem(oneElem('.article-detail')); 
};
