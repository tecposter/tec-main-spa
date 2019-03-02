import {createElem} from 'gap/web';
import {asLoadJs} from './../fun/asLoadJs';
import {asLoadRes} from './../fun/asLoadRes';
import {asSingle} from './../fun/asSingle';

const MonacoScript = 'var require = { paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/vs" } };';
const MonacoRes = {
    csses: [
        [
            'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/vs/editor/editor.main.css',
            {'data-name': 'vs/editor/editor.main'}
        ]
    ],
    jses: [
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/vs/loader.js',
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/vs/editor/editor.main.nls.js',
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/vs/editor/editor.main.js',
    ]
};
const MonacoBaseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/';
const MonacoWorkerMainUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.15.6/min/vs/base/worker/workerMain.js';

export const asMonaco = async () => {
    return await asSingle('gapCoderMonaco', async () => {
        const scriptElem = createElem('script');
        scriptElem.type = 'text/javascript';
        scriptElem.innerHTML = MonacoScript;

        await asLoadJs(scriptElem);
        await asLoadRes(MonacoRes);

        // https://github.com/Microsoft/monaco-editor/blob/master/docs/integrate-amd-cross.md
        window.MonacoEnvironment = {
            getWorkerUrl: function() {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                    self.MonacoEnvironment = {
                        baseUrl: '${MonacoBaseUrl}'
                    };
                    importScripts('${MonacoWorkerMainUrl}');`
                )}`;
            }
        };
        return window.monaco;
    });
};
