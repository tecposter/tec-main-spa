import {View} from 'gap/View';

const Event = {
    click: 'click'
};

export class TecBtn extends View {
    template() {
        return this.html`
        <button
            on-click=${() => this.triggerClick()}
            class="tec btn round secondary-tint">
            <i 
                ref=${icon => this.icon = icon}
                class="iconfont icon-menu"></i>
        </button>
        `;
    }

    onClick(fun) {
        this.on(Event.click, fun);
    }

    triggerClick() {
        this.trigger(Event.click);
        /*
        if (this.icon.hasClass('icon-menu')) {
            this.icon.removeClass('icon-menu');
            this.icon.addClass('icon-close');
            return;
        }

        this.icon.removeClass('icon-close');
        this.icon.addClass('icon-menu');
        */
    }
}
