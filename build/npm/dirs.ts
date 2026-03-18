/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function getMinimalExtensionIds(): string[] | undefined {
	try {
		const productPath = join(import.meta.dirname, '../../product.json');
		const product = JSON.parse(readFileSync(productPath, 'utf8'));
		const ids = product.minimalBuiltInExtensionIds;
		if (Array.isArray(ids) && ids.length > 0) {
			return ids;
		}
	} catch {
		// ignore
	}
	return undefined;
}

/** Extension id from a dir path (e.g. "extensions/git" -> "git", "extensions/json-language-features/server" -> "json-language-features"). */
function extensionIdFromDir(dir: string): string | null {
	if (!dir.startsWith('extensions/')) {
		return null;
	}
	return dir.replace(/^extensions\//, '').replace(/\\/g, '/').split('/')[0];
}

const minimalIds = getMinimalExtensionIds();
const minimalSet = minimalIds ? new Set(minimalIds) : undefined;

/**
 * Complete list of directories where npm should be executed to install node modules.
 * When product.json has minimalBuiltInExtensionIds (non-empty), only those extension dirs are included.
 */
export const dirs = (() => {
	const raw = [
	'',
	'build',
	'build/vite',
	'extensions',
	'extensions/configuration-editing',
	'extensions/css-language-features',
	'extensions/css-language-features/server',
	'extensions/debug-auto-launch',
	'extensions/debug-server-ready',
	'extensions/emmet',
	'extensions/extension-editing',
	'extensions/git',
	'extensions/git-base',
	'extensions/github',
	'extensions/github-authentication',
	'extensions/grunt',
	'extensions/gulp',
	'extensions/html-language-features',
	'extensions/html-language-features/server',
	'extensions/ipynb',
	'extensions/jake',
	'extensions/json-language-features',
	'extensions/json-language-features/server',
	'extensions/markdown-language-features',
	'extensions/markdown-math',
	'extensions/media-preview',
	'extensions/merge-conflict',
	'extensions/mermaid-chat-features',
	'extensions/microsoft-authentication',
	'extensions/notebook-renderers',
	'extensions/npm',
	'extensions/php-language-features',
	'extensions/references-view',
	'extensions/search-result',
	'extensions/simple-browser',
	'extensions/tunnel-forwarding',
	'extensions/terminal-suggest',
	'extensions/typescript-language-features',
	'extensions/vscode-api-tests',
	'extensions/vscode-colorize-tests',
	'extensions/vscode-colorize-perf-tests',
	'extensions/vscode-test-resolver',
	'remote',
	'remote/web',
	'test/automation',
	'test/integration/browser',
	'test/monaco',
	'test/smoke',
	'test/mcp',
	'.vscode/extensions/vscode-selfhost-import-aid',
	'.vscode/extensions/vscode-selfhost-test-provider',
	'.vscode/extensions/vscode-extras',
	];
	if (!minimalSet) {
		const result = [...raw];
		if (existsSync(`${import.meta.dirname}/../../.build/distro/npm`)) {
			result.push('.build/distro/npm');
			result.push('.build/distro/npm/remote');
			result.push('.build/distro/npm/remote/web');
		}
		return result;
	}
	const filtered = raw.filter(d => {
		const id = extensionIdFromDir(d);
		if (id === null) {
			return true;
		}
		return minimalSet.has(id);
	});
	if (existsSync(`${import.meta.dirname}/../../.build/distro/npm`)) {
		filtered.push('.build/distro/npm');
		filtered.push('.build/distro/npm/remote');
		filtered.push('.build/distro/npm/remote/web');
	}
	return filtered;
})();
