#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const { spawn } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const isWin = process.platform === 'win32';
const script = isWin ? path.join(root, 'scripts', 'test.bat') : path.join(root, 'scripts', 'test.sh');
const child = isWin
	? spawn('cmd', ['/c', script], { stdio: 'inherit', cwd: root, shell: true })
	: spawn('sh', [script, ...process.argv.slice(2)], { stdio: 'inherit', cwd: root });

child.on('close', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
	}
	process.exit(code === undefined ? 0 : code === 255 ? 0 : code);
});
