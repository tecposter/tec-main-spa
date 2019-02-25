import {View} from 'gap/View';

const Event = {
    submit: 'submit',
    show: 'show'
};

export class PublishForm extends View {
    template() {
        return this.html`
        <form 
            on-submit=${() => this.triggerSubmit()}
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
                    ref=${input => this.slugInput = input}
                    bind-value="slug" type="text" name="zcode" value="">
            </label>
            <label>
                is public
                <input
                    ref=${checkbox => this.checkbox = checkbox}
                    checked="checked"
                    type="checkbox">
            </label>
            <button class="btn primary-tint">submit</button>
        </div>
        </form>
        `;
    }

    onShow(fun) {
        this.on(Event.show, fun);
    }

    // onSubmit((slug, isPublic) => {})
    onSubmit(fun) {
        this.on(Event.submit, fun);
    }

    triggerSubmit() {
        const slug = this.slugInput.value.trim();
        const isPublic = this.checkbox.checked;
        this.trigger(Event.submit, slug, isPublic);
    }

    show() {
        super.show();
        this.slugInput.focus();
        this.trigger(Event.show);
    }
}
