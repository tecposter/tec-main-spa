import {createElem} from 'gap/web';
import {GapEvent} from 'gap/GapEvent';

let popId = 0;

export class Pop {
    constructor(mask, opts) {
        this._popId = 'pop' + popId++;
        this._mask = mask;
        this._ctn = createElem('div');
        if (opts && opts.type) {
            this._ctn.addClass(opts.type);
        }

        this._mask.addPop(this._popId, this._ctn);
        this._views = [];

        this._event = new GapEvent();
    }

    appendView(view) {
        if (view.appendTo) {
            view.appendTo(this._ctn);
            this._views.push(view);
        } else {
            throw new Error('require gap/View');
        }
    }

    onShow(fun) {
        this._event.on('show', fun);
    }

    show() {
        this._mask.showPop(this._popId);
        this._views.forEach(view => {
            if (view.focus) {
                view.focus();
            }
        });
        this._event.trigger('show');
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
