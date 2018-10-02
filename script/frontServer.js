#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-console */

'use strict';

const path = require('path');
const localSetting = require('./setting.local');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const baseDir = path.resolve(__dirname, '..');
const port = localSetting.front.port || 8007;
const staticHost = localSetting.site.static.host || 'localhost';

const front = require('gap-node-front')({
    baseDir: baseDir,
    port: port,
    staticHost: staticHost,
    webpack: {
        publicSlug: {
            dev: 'main/dev/js',
            dist: 'main/dist/js'
        },
        contextDir: 'src/web',
        outputDir: {
            dev: 'site/static/main/dev/js',
            dist: 'site/static/main/dist/js'
        },
        alias: {},
        modules: [
            'node_modules'
        ],
        entry: {
            main: './main.js',
            'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
            'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
            'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
            'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
            'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
        },
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }],
        plugins: [
            new MonacoWebpackPlugin()
        ]
    }
});

const cmd = process.argv[2];

if (cmd === 'server') {
    front.runServer();
} else if (cmd === 'release') {
    front.release();
}
