import {Pop} from 'Pop';

export class Helper extends Pop {
    template() {
        return this.html`
        <div class="helper ctn">
            <h2 class="title large">Helper</h2>
            <div class="mode">
                <ul>
                    <li>[esc] - esc - Close pops</li>
                    <li>[ctrl-s] - update - Update Article Commit</li>
                    <li>[ctrl-;] - cmd - Show command dialog</li>
                </ul>
            </div>
        </div><!-- .helper -->
        `;
    }
}
