import {Pop} from 'gap/Pop';

export class HelpPop extends Pop {
    template() {
        return this.html`
        <div class="help ctn">
            <h2 class="title large">Help</h2>
            <div class="mode">
                <ul>
                    <li>[esc] - esc - Close pops</li>
                    <li>[ctrl-s] - update - Update Article Commit</li>
                    <li>[ctrl-;] - cmd - Show command dialog</li>
                </ul>
            </div>
        </div><!-- .help -->
        `;
    }
}
