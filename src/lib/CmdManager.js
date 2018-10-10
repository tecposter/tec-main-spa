const Mode = {
    normal: 'normal',
    edit: 'edit'
};

const KeyMap = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    27: 'esc',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    186: ';', // semi-colon
    187: '=', // equal-sign
    188: ',', // comma
    189: '-', // dash
    190: '.', // period
    191: '/', // forward slash
    192: '`', // grave accent
    219: '[', // open bracket
    220: '\\', // back slash
    221: ']', // close bracket
    222: '\'' // single quote
};

export class CmdManager {
    constructor() {
        this.mode = Mode.normal;
        this.cmds = {};
        this.shortKeys = {};

        document.on('keydown', async evt => {
            if (!this.cmds[this.mode]) {
                return;
            }

            const shortKey = this.parseShortKey(evt);
            const cmd = this.shortKeys[this.mode][shortKey];
            if (!cmd) {
                return;
            }

            const cmdObj = this.cmds[this.mode][cmd];
            if (!cmdObj) {
                return;
            }

            evt.cancel();
            evt.stop();
            cmdObj.fun.apply(null);
        });
    }

    parseShortKey(evt) {
        let prefixs = [];
        if (evt.ctrlKey) {
            prefixs.push('ctrl');
        }
        if (evt.metaKey) {
            prefixs.push('meta');
        }
        if (evt.altKey) {
            prefixs.push('alt');
        }
        if (evt.shiftKey) {
            prefixs.push('shift');
        }
        const keyCode = evt.keyCode;
        let char = '';
        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90)) {
            char = String.fromCharCode(keyCode).toLowerCase();
        } else if (keyCode >= 112 && keyCode <= 123) {
            char = 'f' + (keyCode - 111);
        } else {
            char = KeyMap[keyCode];
        }

        if (char === undefined) {
            return '';
        }
        const shortKey = (prefixs.length > 0) ? `${prefixs.join('-')}-${char}` : char;
        return shortKey;
    }

    setMode(mode) {
        this.mode = mode;
    }

    _argToArr(arg) {
        let arr;
        if (Array.isArray(arg)) {
            arr = arg;
        } else if (typeof arg === 'string') {
            arr = [arg];
        } else {
            throw new Error('unkown format');
        }
        return arr;
    }

    _parseCmd(inCmd) {
        let cmd, desc;
        const pos = inCmd.indexOf(':');
        if (pos > 0) {
            cmd = inCmd.substr(0, pos);
            desc = inCmd.substr(pos + 1).trim();
        } else {
            cmd = inCmd.trim();
        }
        return [cmd, desc];
    }

    register(inCmd, inShortKeys, fun, inModes) {
        const modes = this._argToArr(inModes || this.mode);
        const shortKeys = this._argToArr(inShortKeys);
        const [cmd, desc] = this._parseCmd(inCmd);

        modes.forEach(mode => {
            this.addCmd(mode, cmd, desc, fun, shortKeys);
            shortKeys.forEach(shortKey => this.addShortKey(mode, shortKey, cmd));
        });
    }

    trigger(cmd) {
        const cmdSet = this.getCmdSet(this.mode);
        if (!cmdSet.hasOwnProperty(cmd)) {
            console.warn(`cannot find cmd: ${this.mode} - ${cmd}`); // eslint-disable-line no-console
            return;
            //throw new Error(`Cannot find cmd: ${this.mode} - ${cmd}`);
        }
        const cmdObj = cmdSet[cmd];
        cmdObj.fun.apply(null);
    }

    addCmd(mode, cmd, desc, fun, shortKeys) {
        const cmdSet = this.getCmdSet(mode);
        if (cmdSet.hasOwnProperty(cmd)) {
            throw new Error(`duplicated cmd: ${mode} - ${cmd}`);
        }
        cmdSet[cmd] = {desc, fun, shortKeys};
    }

    addShortKey(mode, shortKey, cmd) {
        const shortKeySet = this.getShortKeySet(mode);
        if (shortKeySet.hasOwnProperty(shortKey)) {
            throw new Error(`duplicated short key: ${mode} - ${shortKey}`);
        }
        shortKeySet[shortKey] = cmd;
    }

    getCmdSet(mode) {
        if (this.cmds[mode]) {
            return this.cmds[mode];
        }
        this.cmds[mode] = {};
        return this.cmds[mode];
    }

    getShortKeySet(mode) {
        if (this.shortKeys[mode]) {
            return this.shortKeys[mode];
        }
        this.shortKeys[mode] = {};
        return this.shortKeys[mode];
    }
}

CmdManager.Mode = Mode;

// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
/*
if (charCode == 8) textBox.value = "backspace"; //  backspace
if (charCode == 9) textBox.value = "tab"; //  tab
if (charCode == 13) textBox.value = "enter"; //  enter
if (charCode == 16) textBox.value = "shift"; //  shift
if (charCode == 17) textBox.value = "ctrl"; //  ctrl
if (charCode == 18) textBox.value = "alt"; //  alt
if (charCode == 19) textBox.value = "pause/break"; //  pause/break
if (charCode == 20) textBox.value = "caps lock"; //  caps lock
if (charCode == 27) textBox.value = "escape"; //  escape
if (charCode == 33) textBox.value = "page up"; // page up, to avoid displaying alternate character and confusing people	         
if (charCode == 34) textBox.value = "page down"; // page down
if (charCode == 35) textBox.value = "end"; // end
if (charCode == 36) textBox.value = "home"; // home
if (charCode == 37) textBox.value = "left arrow"; // left arrow
if (charCode == 38) textBox.value = "up arrow"; // up arrow
if (charCode == 39) textBox.value = "right arrow"; // right arrow
if (charCode == 40) textBox.value = "down arrow"; // down arrow
if (charCode == 45) textBox.value = "insert"; // insert
if (charCode == 46) textBox.value = "delete"; // delete
if (charCode == 91) textBox.value = "left window"; // left window
if (charCode == 92) textBox.value = "right window"; // right window
if (charCode == 93) textBox.value = "select key"; // select key
if (charCode == 96) textBox.value = "numpad 0"; // numpad 0
if (charCode == 97) textBox.value = "numpad 1"; // numpad 1
if (charCode == 98) textBox.value = "numpad 2"; // numpad 2
if (charCode == 99) textBox.value = "numpad 3"; // numpad 3
if (charCode == 100) textBox.value = "numpad 4"; // numpad 4
if (charCode == 101) textBox.value = "numpad 5"; // numpad 5
if (charCode == 102) textBox.value = "numpad 6"; // numpad 6
if (charCode == 103) textBox.value = "numpad 7"; // numpad 7
if (charCode == 104) textBox.value = "numpad 8"; // numpad 8
if (charCode == 105) textBox.value = "numpad 9"; // numpad 9
if (charCode == 106) textBox.value = "multiply"; // multiply
if (charCode == 107) textBox.value = "add"; // add
if (charCode == 109) textBox.value = "subtract"; // subtract
if (charCode == 110) textBox.value = "decimal point"; // decimal point
if (charCode == 111) textBox.value = "divide"; // divide
if (charCode == 112) textBox.value = "F1"; // F1
if (charCode == 113) textBox.value = "F2"; // F2
if (charCode == 114) textBox.value = "F3"; // F3
if (charCode == 115) textBox.value = "F4"; // F4
if (charCode == 116) textBox.value = "F5"; // F5
if (charCode == 117) textBox.value = "F6"; // F6
if (charCode == 118) textBox.value = "F7"; // F7
if (charCode == 119) textBox.value = "F8"; // F8
if (charCode == 120) textBox.value = "F9"; // F9
if (charCode == 121) textBox.value = "F10"; // F10
if (charCode == 122) textBox.value = "F11"; // F11
if (charCode == 123) textBox.value = "F12"; // F12
if (charCode == 144) textBox.value = "num lock"; // num lock
if (charCode == 145) textBox.value = "scroll lock"; // scroll lock
if (charCode == 186) textBox.value = ";"; // semi-colon
if (charCode == 187) textBox.value = "="; // equal-sign
if (charCode == 188) textBox.value = ","; // comma
if (charCode == 189) textBox.value = "-"; // dash
if (charCode == 190) textBox.value = "."; // period
if (charCode == 191) textBox.value = "/"; // forward slash
if (charCode == 192) textBox.value = "`"; // grave accent
if (charCode == 219) textBox.value = "["; // open bracket
if (charCode == 220) textBox.value = "\\"; // back slash
if (charCode == 221) textBox.value = "]"; // close bracket
if (charCode == 222) textBox.value = "'"; // single quote
 */
