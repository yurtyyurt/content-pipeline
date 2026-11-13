import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const target=resolve('collector');
process.chdir(target);
await import(pathToFileURL(join(target,'src/free-web.mjs')).href);
