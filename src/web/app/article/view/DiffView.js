import {createElem} from 'gap/web';

export class DiffView {
    constructor(monaco, localModel) {
        this.monaco = monaco;

        this.ctn = createElem('div');
        this.ctn.html`
            <div class="diff-top">
                <a data-key="remote-draft" class="item selected" href="javascript:;">Remote Draft</a>
                <a data-key="released-article" class="item" href="javascript:;">Released Article</a>
            </div>
            <div class="diff-main"></div>
        `;

        this.ctn.addClass('diff');
        this.localModel = localModel;

        this.ctn.allElem('.item').forEach(item => {
            item.on('click', () => {
                this.switchItem(item);
                this.triggerChange(item.getAttribute('data-key'));
            });
        });

        this.isInited = false;
    }

    showDiff() {
        const selectedItem = this.ctn.oneElem('.item.selected');
        this.triggerChange(selectedItem.getAttribute('data-key'));
    }

    switchItem(item) {
        this.ctn.allElem('.item.selected').forEach(item => item.removeClass('selected'));
        item.addClass('selected');
    }

    triggerChange(key) {
        if (this.handleChange) {
            this.handleChange(key);
        }
    }

    onChange(fun) {
        this.handleChange = fun;
    }

    init() {
        this.remoteModel = this.monaco.editor.createModel('original', 'markdown');
        this.diffEditor = this.monaco.editor.createDiffEditor(
            this.ctn.oneElem('.diff-main'),
            {
                wordWrap: 'wordWrapColumn',
                wordWrapColumn: 84,
                wordWrapMinified: true,
                wrappingIndent: 'same'
            }
        );
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
