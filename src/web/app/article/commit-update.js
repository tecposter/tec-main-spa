import {MonacoEditor} from 'MonacoEditor';
import {oneElem} from 'web-util';

export default async core => {
    const editor = new MonacoEditor(core.setting.pageConfig.commitDto.content);
    editor.appendTo(oneElem('.page'));
};
