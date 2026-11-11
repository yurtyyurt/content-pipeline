import {mkdir,lstat,symlink} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const target=resolve('collector'),runtime='/var/data/pulse';
await mkdir(runtime,{recursive:true,mode:0o700});
try{const link=await lstat(join(target,'runtime'));if(!link.isSymbolicLink())throw Error('Collector runtime must point at the persistent disk')}catch(e){if(e.code!=='ENOENT')throw e;await symlink(runtime,join(target,'runtime'))}
process.chdir(target);
await import(pathToFileURL(join(target,'src/supervisor.mjs')).href);
