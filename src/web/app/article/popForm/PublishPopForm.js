import {Pop} from 'gap/Pop';

export class PublishPopForm extends Pop {
    template() {
        return this.html`
        <form 
            on-submit=${() => this.trigger('submit', this.input.value.trim(), this.checkbox.checked)}
            action="javascript:;" method="post">
        <div class="form-content">
            <h2 class="title">Publish</h2>
            <p>
                title:
                <strong>$${'title'}</strong>
            </p>
            <label>
                /article/
                <input
                    ref=${input => this.input = input}
                    bind-value="zcode" type="text" name="zcode" value="">
            </label>
            <label>
                is public
                <input
                    ref=${checkbox => this.checkbox = checkbox}
                    type="checkbox">
            </label>
            <button class="btn primary-tint">submit</button>
        </div>
        </form>
        `;
    }

    show() {
        super.show();
        this.trigger('show');
    }
}
