import {Pop as GapPop} from 'gap-front-mask';

export class Pop extends GapPop {
    show() {
        this.mask.hideAllPop();
        super.show();
    }
}
