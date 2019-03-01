import {createElem} from 'gap/web';

export class DiffView {
    constructor(monaco, localModel) {
        this.monaco = monaco;

        this.ctn = createElem('div');
        this.ctn.addClass('diff');
        this.localModel = localModel;

        this.isInited = false;
    }

    init() {
        this.remoteModel = this.monaco.editor.createModel('original', 'markdown');
        this.diffEditor = this.monaco.editor.createDiffEditor(this.ctn);
        this.diffEditor.setModel({
            original: this.remoteModel,
            modified: this.localModel
        });
        this.isInited = true;
    }

    appendTo(elem) {
        if (elem.appendChild) {
            elem.appendChild(this.ctn);
        }
    }

    diff(original) {
        if (!this.isInited) {
            this.init();
        }

        this.remoteModel.setValue(original);
    }
}
