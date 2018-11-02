import {asLoadJs} from 'html/asLoadJs';
import {asLoadRes} from './fun/asLoadRes';
import {asSingleTon} from './fun/asSingleTon';
import {createElem} from 'gap/web';

const DefaultContent = '# TecPoster Markdown Editor';
const MonacoScript = 'var require = { paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs" } };';
const MonacoRes = {
    csses: [
        [
            'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.css',
            {'data-name': 'vs/editor/editor.main'}
        ]
    ],
    jses: [
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/loader.js',
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.nls.js',
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.js',
    ]
};
const MonacoBaseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/';
const MonacoWorkerMainUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/base/worker/workerMain.js';
let CoderIndex = 0;

export class Coder {
    constructor(ctnElem, content) {
        this.content = content || DefaultContent;
        this.ctnElem = ctnElem;

        this.id = CoderIndex++;

        this.asGetMonaco();
    }

    onChange(callback) {
        this.asOnChange(callback);
    }

    onScroll(callback) {
        this.asOnScroll(callback);
    }

    getContent() {
        const codeEditor = this.getCodeEditor();
        return codeEditor ? codeEditor.getValue() : '';
    }

    getLineCount() {
        const monaco = this.getCodeEditor();
        if (!monaco) {
            return 0;
        }
        return monaco.viewModel.lines.lines.length;
    }

    getVisibleRange() {
        const monaco = this.getCodeEditor();
        if (!monaco) {
            return {
                startLineNumber: 0,
                endLineNumber: 0
            };
        }
        return monaco.getVisibleRanges()[0];
    }

    //
    // private funs
    //

    getCodeEditor() {
        return this._codeEditor || null;
    }


    async asCreateCodeEditor() {
        const monaco = await this.asGetMonaco();
        return monaco.editor.create(this.ctnElem, {
            value: this.content,
            language: 'markdown',
            wordWrap: 'wordWrapColumn',
            wordWrapColumn: 84,
            wordWrapMinified: true,
            wrappingIndent: 'same'
        });
    }

    async asGetCodeEditor() {
        if (this._codeEditor) {
            return this._codeEditor;
        }
        this._codeEditor = await asSingleTon('gapCoderCodeEditor-' + this.id, this, 'asCreateCodeEditor');
        return this._codeEditor;
    }

    async asCreateMonaco() {
        const scriptElem = createElem('script');
        scriptElem.type = 'text/javascript';
        scriptElem.innerHTML = MonacoScript;

        await this.asLoadJs(scriptElem);
        await this.asLoadRes(MonacoRes);

        // https://github.com/Microsoft/monaco-editor/blob/master/docs/integrate-amd-cross.md
        window.MonacoEnvironment = {
            getWorkerUrl: function() {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                    self.MonacoEnvironment = {
                        baseUrl: '${MonacoBaseUrl}'
                    };
                    importScripts('${MonacoWorkerMainUrl}');`
                )}`;
            }
        };
        return window.monaco;
    }
    
    async asGetMonaco() {
        return await asSingleTon('gapCoderMonaco', this, 'asCreateMonaco');
    }

    async asLoadRes(res) {
        await asLoadRes(res);
    }

    async asLoadJs(js, attrs = {}) {
        await asLoadJs(js, attrs);
    }

    async asOnChange(callback) {
        const monaco = await this.asGetCodeEditor();
        monaco.onDidChangeModelContent(callback);
    }

    async asOnScroll(callback) {
        (await this.asGetCodeEditor()).onDidScrollChange(callback);
    }
}
