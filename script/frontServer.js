#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-console */

'use strict';

const path = require('path');
const localSetting = require('./setting.local');

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
            'node_modules',
            'src/lib',
            'src/internal',
            'src/third'
        ],
        entry: {
            main: './main.js'
        },
    }
});

const cmd = process.argv[2];

if (cmd === 'server') {
    front.runServer();
} else if (cmd === 'release') {
    front.release();
}
