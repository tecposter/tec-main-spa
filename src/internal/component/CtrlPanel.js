import {View} from 'gap/View';

export class CtrlPanel extends View {
    template() {
        return this.html`
        <div class="ctrl-panel">
            <div ref=${ctrlMenu => this.ctrlMenu = ctrlMenu}
                class="ctrl-menu hide">
                <div class="card surface-tint">
                    <div class="section">
                        <ul>
                            ${this.generateMenuItemsHtml(this.props.menuItems)}
                        </ul>
                    </div>
                </div><!-- .card -->
            </div>
            <button
                on-click=${() => this.toggleCtrlMenu()}
                class="btn round secondary-tint">
                <i 
                    ref=${icon => this.icon = icon}
                    class="iconfont icon-menu"></i>
            </button>
        </div>
        `;
    }

    toggleCtrlMenu() {
        if (this.ctrlMenu.hasClass('hide')) {
            this.icon.removeClass('icon-menu');
            this.icon.addClass('icon-close');
            this.ctrlMenu.removeClass('hide');
        } else {
            this.icon.removeClass('icon-close');
            this.icon.addClass('icon-menu');
            this.ctrlMenu.addClass('hide');
        }
    }

    generateMenuItemsHtml(menuItems) {
        if (!Array.isArray(menuItems)) {
            return '';
        }

        return menuItems.map(menuItem => {
            return `
            <li>
                <a href="javascript:;">
                    ${menuItem.title}
                </a>
            </li>
            `;
        });
    }
}
