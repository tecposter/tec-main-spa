import {asLoadRes} from './fun/asLoadRes';
import {asSingleTon} from './fun/asSingleTon';

const HighlightRes = {
    csses: ['https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css'],
    jses: [
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/languages/go.min.js'
    ]
};

const MarkdonwItRes = {
    jses: ['https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.2/markdown-it.min.js']
};

const KatexRes = {
    csses:[
        [
            'https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css',
            {
                integrity: 'sha384-9eLZqc9ds8eNjO3TmqPeYcDj8n+Qfa4nuSiGYa6DjLNcv9BtN69ZIulL9+8CqC9Y',
                crossorigin: 'anonymous'
            }
        ]
    ],
    jses: [
        [
            'https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js',
            {
                integrity: 'sha384-K3vbOmF2BtaVai+Qk37uypf7VrgBubhQreNQe9aGsz9lB63dIFiQVlJbr92dw2Lx',
                crossorigin: 'anonymous'
            }
        ]
    ]
};

export class Parser {
    constructor() {
        this.asGetHljs();
        this.asGetKatex();
        this.asGetMarkdownIt();
    }

    async asToHtml(str) {
        const mdit = await this.asGetMdit();
        const katex = await this.asGetKatex();

        // https://github.com/goessner/markdown-it-texmath/blob/8c460feea79b4ee0153f674ee5450e59b85cc944/texmath.js
        const mathBlockPattern = /(\${2})((?:\\.|[\s\S])*)\1/g;
        const mathInlinePattern = /\\\((.+?)\\\)/g;

        return mdit.render(str.trim())
            .replace(mathInlinePattern, (match, src) => {
                return katex.renderToString(src);
            })
            .replace(mathBlockPattern, (match, tag, src) => {
                return '<div>' + katex.renderToString(src) + '</div>';
            });
    }

    async asRenderElem(elem) {
        elem.innerHTML = await this.asToHtml(elem.textContent.trim());
    }

    //
    // private functions
    //

    async asGetMdit() {
        if (this._mdit) {
            return this._mdit;
        }

        //await this.asLoadRes(HighlightRes);
        const hljs = await this.asGetHljs();
        const katex = await this.asGetKatex();
        const markdownit = await this.asGetMarkdownIt();

        const mdit = markdownit({
            highlight: (str, inLang) => {
                const lang = inLang.toLowerCase().trim();

                if (lang === 'math') {
                    return katex.renderToString(str);
                } else if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre class="hljs"><code>' +
                            hljs.highlight(lang, str, true).value +
                            '</code></pre>';
                    } catch (err) {
                        throw err;
                    }
                }
                return '<pre class="hljs"><code>' + mdit.utils.escapeHtml(str) + '</code></pre>';
            }
        });
        this._mdit = mdit;
        return this._mdit;
    }

    async asCreateMarkdownIt() {
        await this.asLoadRes(MarkdonwItRes);
        return window.markdownit;
    }

    async asGetMarkdownIt() {
        return await asSingleTon('gapParserMarkdownIt', this, 'asCreateMarkdownIt');
    }

    async asCreateHljs() {
        await this.asLoadRes(HighlightRes);
        return window.hljs;
    }

    async asGetHljs() {
        return await asSingleTon('gapParserHljs', this, 'asCreateHljs');
    }

    async asCreateKatex() {
        await this.asLoadRes(KatexRes);
        return window.katex;
    }

    async asGetKatex() {
        return await asSingleTon('gapParserKatex', this, 'asCreateKatex');
    }

    async asLoadRes(res) {
        await asLoadRes(res);
    }

    /*
     * tokeep
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
    */
}
