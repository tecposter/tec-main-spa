import {createElem} from 'gap/web';

let popId = 0;

export class Pop {
    constructor(mask) {
        this._popId = 'pop' + popId++;
        this._mask = mask;
        this._ctn = createElem('div');
        this._mask.addPop(this._popId, this._ctn);
        //this._ctn.appendChild(elem);
    }

    appendView(view) {
        if (view.appendTo) {
            view.appendTo(this._ctn);
        }
    }

    show() {
        this._mask.showPop(this._popId);
    }

    hide() {
        this._mask.hidePop(this._popId);
    }

    hideMask() {
        this._mask.hideMask();
    }

    hideAll() {
        this.hidePop();
        this.hideMask();
    }
}
