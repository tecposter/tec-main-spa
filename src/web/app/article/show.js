import {oneElem} from 'web-util';
import {MarkdownPreview} from 'MarkdownPreview';

export default async () => {
    const markdownPreview = new MarkdownPreview();
    markdownPreview.preview(oneElem('.article-detail')); 
};
