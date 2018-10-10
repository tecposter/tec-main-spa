import {appendCssLink} from 'appendCssLink';
import {asLoadJs} from 'asLoadJs';

export class MarkdownPreview {
    /*
    constructor() {
        this.startup();
    }

    async startup() {
        this.mdit = await this.asCreateMdit();
    }
    */

    async asCreateMdit() {
        const csses = ['https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css'];
        const jses = [
            'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.2/markdown-it.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/languages/go.min.js'
        ];
        csses.forEach(css => this.appendCssLink(css));
        for (const src of jses) {
            await this.asLoadJs(src);
        }
        const mdit = window.markdownit({
            highlight: (str, lang) => {
                if (lang && window.hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            window.hljs.highlight(lang, str, true).value +
                            '</code></pre>';
                    } catch (err) {
                        throw err;
                    }
                }
                return '<pre class="hljs"><code>' + mdit.utils.escapeHtml(str) + '</code></pre>';
            }
        });
        return mdit;
    }

    async asInitMathJax() {
        const jses = [
            'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML'
        ];
        for (const src of jses) {
            await this.asLoadJs(src);
        }

        window.MathJax.Hub.Config({
            jax: ['input/TeX','output/HTML-CSS'],
            tex2jax: {
                inlineMath: [['\\(','\\)']],
                processEscapes: true
            },
            skipStartupTypeset: true,
            displayAlign: 'left'
        });
    }

    appendCssLink(href, attrs = {}) {
        appendCssLink(href, attrs);
    }

    async asLoadJs(src) {
        await asLoadJs(src);
    }

    async preview(elem) {
        const mdit = await this.asCreateMdit();
        await this.asInitMathJax();

        elem.innerHTML = mdit.render(elem.textContent.trim());
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, elem]);
    }
}
