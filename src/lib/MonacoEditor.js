import {oneElem, createElem} from 'web-util';

const DefaultContent = '# TecPoster Markdown Editor';

export class MonacoEditor {
    constructor(content) {
        this.head = oneElem('head');
        this.page = oneElem('.page');
        this.jses = [];
        this.jsCallbacks = [];
        this.content = content || DefaultContent;
        document.title = this.extractTitle(this.content);

        this.isChanged = false;
        this.isPreviewBlocked = false;
        this.editorWrap = this.createEditorWrap();
        this.previewElem = this.editorWrap.oneElem('#editor-preview');
        this.previewWrap = this.previewElem.parentElement;

        this.startup();
    }

    async startup() {
        this.mdit = await this.asCreateMdit();
        await this.asInitMathJax();
        this.codeEditor = await this.asCreateCodeEditor(
            this.editorWrap.oneElem('#monaco-editor'),
            this.content
        );
        this.previewHtml(this.content);

        this.codeEditor.onDidChangeModelContent(() => {
            if (!this.isPreviewBlocked) {
                const codeContent = this.codeEditor.getValue();
                this.previewHtml(codeContent);
                this.isChanged = true;
                document.title = '* ' + this.extractTitle(codeContent);
            }
        });

        this.codeEditor.onDidScrollChange((evt) => {
            if (!evt.scrollTopChanged) {
                return;
            }

            const lineCount = this.codeEditor.viewModel.lines.lines.length;
            const visibleRange = this.codeEditor.getVisibleRanges()[0];

            const srcMax = lineCount - (visibleRange.endLineNumber - visibleRange.startLineNumber);
            this.previewWrap.scrollTop = (this.previewWrap.scrollHeight - this.previewWrap.offsetHeight) * visibleRange.startLineNumber / srcMax;
        });

        window.onbeforeunload = (evt) => {
            if (!this.isChanged) {
                return;
            }

            evt.stop();
            evt.cancel();
            (evt || window.event).returnValue = null;
            return null;
        };

    }

    appendTo(ctnElem) {
        ctnElem.appendChild(this.editorWrap);
    }

    getContent() {
        return this.codeEditor.getValue();
    }

    getTitle() {
        return this.extractTitle(this.getContent());
    }

    setContent(content) {
        this.isPreviewBlocked = true;
        this.codeEditor.setValue(content);
        this.previewHtml(content);
        document.title = this.extractTitle(content);
        this.isPreviewBlocked = false;
        this.isChanged = false;

    }

    saved() {
        document.title = this.getTitle();
        this.isChanged = false;
        this.isPreviewBlocked = false;
    }

    extractTitle(content) {
        const matched = /# ([^#\n]+)/.exec(content);
        if (matched) {
            return matched[1];
        }
        return '';
    }

    previewHtml(content) {
        this.previewElem.innerHTML = this.mdit.render(content);
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.previewElem]);
    }

    asLoadJs(src) {
        const createScriptElem = (src) => {
            if (typeof(src) !== 'string') {
                throw new Error('must be string');
            }
            const elem = createElem('script');
            elem.type = 'text/javascript';
            elem.src = src;
            return elem;
        };

        return new Promise((resolve) => {
            const scriptElem = (src instanceof HTMLScriptElement) ? src : createScriptElem(src);
            this.head.appendChild(scriptElem);
            if (scriptElem.src) {
                scriptElem.on('load', () => {
                    resolve(true);
                });
            } else {
                resolve(true);
            }
        });
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

    createEditorWrap() {
        const styleElem = createElem('style');
        styleElem.setAttribute('type', 'text/css');
        styleElem.innerHTML = `
            html, body, .page {
                height: 100%;
            }
        `;
        this.head.appendChild(styleElem);

        const editorWrapElem = createElem('div');
        editorWrapElem.addClass('editor-wrap');
        editorWrapElem.html`
            <div class="item editor-section">
                <div class="editor" id="monaco-editor"></div>
            </div>
            <div class="item preview-section">
                <div class="preview" id="editor-preview"></div>
            </div>
        `;
        return editorWrapElem;
    }

    async asCreateCodeEditor(ctnElem, content) {
        this.appendCssLink(
            'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.css',
            {'data-name': 'vs/editor/editor.main'}
        );

        const scriptElem = createElem('script');
        scriptElem.type = 'text/javascript';
        scriptElem.innerHTML = 'var require = { paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs" } };';
        await this.asLoadJs(scriptElem);

        const jses = [
            'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/loader.js',
            'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.nls.js',
            'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.js',
        ];
        for (const src of jses) {
            await this.asLoadJs(src);
        }

        const codeEditor = window.monaco.editor.create(ctnElem, {
            value: content,
            language: 'markdown',
            wordWrap: 'wordWrapColumn',
            wordWrapColumn: 84,
            wordWrapMinified: true,
            wrappingIndent: 'same'
        });
        return codeEditor;
    }

    appendCssLink(href, attrs = {}) {
        const link = createElem('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.media = 'screen,print';
        link.href = href;

        for (const attrName in attrs) {
            link.setAttribute(attrName, attrs[attrName]);
        }

        this.head.appendChild(link);
    }

    prepareJses(srcs, callback) {
        srcs.forEach(src => this.jses.push(src));

        if (callback) {
            this.jsCallbacks.push(callback);
        }
    }
}
/*
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
<link rel="stylesheet" data-name="vs/editor/editor.main" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.css">
*/
