/*
  @license
	Rollup.js v4.14.3
	Mon, 15 Apr 2024 07:18:00 GMT - commit e64f3d8d0cdc561f00d3efe503e3081f81889679

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
