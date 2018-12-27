import {createElem, oneElem} from 'gap/web';

import {Coder} from './Coder';
import {Parser} from './Parser';
import {GapEvent} from 'gap/GapEvent';

const DefaultContent = '# Title\n';
const EventChange = 'change';

export class Editor {
    constructor(ctnElem, content) {
        this.ctnElem = ctnElem;
        this.content = content || DefaultContent;

        this._isPreviewBlocked = false;
        this._isChanged = false;

        this.buildCtn(this.ctnElem);

        this.event = new GapEvent();
        this.parser = this.getParser();
        this.coder = this.getCoder();

        this.asStartup();
    }

    onChange(callback) {
        this.event.on(EventChange, callback);
    }

    isChanged() {
        return this._isChanged;
    }

    saved() {
        this._isChanged = false;
        this._isPreviewBlocked = false;
    }

    getTitle() {
        return this.extractTitle(this.getContent());
    }

    getContent() {
        return this.coder.getContent();
    }

    //
    // private funs
    //

    getCoder() {
        if (this._coder) {
            return this._coder;
        }
        this._coder = new Coder(this.getCoderElem(), this.content);
        return this._coder;
    }

    getParser() {
        if (this._parser) {
            return this._parser;
        }
        this._parser = new Parser();
        return this._parser;
    }

    getCoderElem() {
        if (this._coderElem) {
            return this._coderElem;
        }
        this._coderElem = this.ctnElem.oneElem('.coder');
        return this._coderElem;
    }

    getPreviewElem() {
        if (this._previewElem) {
            return this._previewElem;
        }
        this._previewElem = this.ctnElem.oneElem('.preview');
        return this._previewElem;
    }

    getPreviewWrap() {
        if (this._previewWrap) {
            return this._previewWrap;
        }
        this._previewWrap = this.getPreviewElem().parentElement;
        return this._previewWrap;
    }

    buildCtn(ctn) {
        const styleElem = createElem('style');
        styleElem.setAttribute('type', 'text/css');
        styleElem.innerHTML = `
            html, body, .page {
                height: 100%;
                overflow: hidden;
            }
        `;
        oneElem('head').appendChild(styleElem);

        ctn.addClass('markdown-editor');
        ctn.html`
            <div class="item coder-section">
                <div class="coder" id="editor-coder"></div>
            </div>
            <div class="item preview-section">
                <div class="preview" id="editor-preview"></div>
            </div>
        `;
    }

    extractTitle(content) {
        const matched = /# ([^\n]+)/.exec(content);
        if (matched) {
            return matched[1];
        }
        return '';
    }

    // ---

    async asStartup() {
        this.asPreview(this.content);
        
        const coder = this.coder;
        coder.onChange(() => {
            if (!this._isPreviewBlocked) {
                const codeContent = coder.getContent();
                this.asPreview(codeContent);
                this._isChanged = true;
                this.event.trigger(EventChange);
                //document.title = '* ' + this.extractTitle(codeContent);
            }
        });

        coder.onScroll(evt => {
            if (!evt.scrollTopChanged) {
                return;
            }
            const lineCount = coder.getLineCount();
            const visible = coder.getVisibleRange();
            const max = lineCount - (visible.endLineNumber - visible.startLineNumber);

            const previewWrap = this.getPreviewWrap();
            previewWrap.scrollTop = (previewWrap.scrollHeight - previewWrap.offsetHeight) * visible.startLineNumber / max;
        });
    }


    async asPreview(content) {
        this.getPreviewElem().innerHTML = await this.parser.asToHtml(content);
    }
}
