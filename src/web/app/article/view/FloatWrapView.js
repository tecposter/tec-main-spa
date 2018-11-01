import {View} from 'gap/View';

export class FloatWrapView extends View {
    template() {
        return this.html`
        <div class="float-wrap">
            <button class="btn secondary-tint">
                <i class="iconfont icon-menu"></i>
            </button>
        </div>
        `;
    }
}
