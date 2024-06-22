/*
  @license
	Rollup.js v4.16.4
	Tue, 23 Apr 2024 13:14:37 GMT - commit 1c404fa352b70007066e94ff4c1981f8046f8cef

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
export { version as VERSION, defineConfig, rollup, watch } from './shared/node-entry.js';
import './shared/parseAst.js';
import '../native.js';
import 'node:path';
import 'path';
import 'node:process';
import 'node:perf_hooks';
import 'node:fs/promises';
import 'tty';
