import {asSingle} from './../fun/asSingle';
import {asMonaco} from './../monaco/asMonaco';

const DefaultContent = '# TecPoster Markdown Editor';
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

    async asGetCodeModel() {
        return (await this.asGetCodeEditor()).getModel();
    }

    getLineCount() {
        const monaco = this.getCodeEditor();
        if (!monaco) {
            return 0;
        }
        return monaco.getModel().getLineCount();
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
        this._codeEditor = await asSingle('gapCoderCodeEditor-' + this.id, async () => this.asCreateCodeEditor());
        return this._codeEditor;
    }

    async asGetMonaco() {
        return await asMonaco();
    }

    async asOnChange(callback) {
        const monaco = await this.asGetCodeEditor();
        monaco.onDidChangeModelContent(callback);
    }

    async asOnScroll(callback) {
        (await this.asGetCodeEditor()).onDidScrollChange(callback);
    }
}
