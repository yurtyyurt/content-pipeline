import {createHash} from 'node:crypto';
import {mkdir,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
export async function installBot({env=process.env,fetcher=fetch,run=execFileSync,dir=process.cwd()}={}){
 const site=new URL(env.PULSE_SITE_URL),expected=env.PULSE_BOT_SHA256;
 if(site.protocol!=='https:'||site.username||site.password||!env.PULSE_SITE_ACCESS_TOKEN||!/^[a-f0-9]{64}$/.test(expected||''))throw Error('Valid private package credentials and pinned digest required');
 const r=await fetcher(new URL('/downloads/pump-pulse-telegram.tar.gz',site),{headers:{'OAI-Sites-Authorization':'Bearer '+env.PULSE_SITE_ACCESS_TOKEN},redirect:'error',signal:AbortSignal.timeout(60000)});
 if(!r.ok)throw Error('Private package download failed ('+r.status+')');
 const chunks=[];let length=0;for await(const chunk of r.body){length+=chunk.length;if(length>32*1024*1024)throw Error('Private package too large');chunks.push(chunk)}
 const bytes=Buffer.concat(chunks);if(createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('Private package digest mismatch; refusing to run');
 const temp=await mkdtemp(join(tmpdir(),'pulse-install-')),target=join(dir,'collector');
 try{const archive=join(temp,'bot.tar.gz');await writeFile(archive,bytes,{mode:0o600});await mkdir(target,{recursive:true});run('tar',['-xzf',archive,'-C',target],{stdio:'inherit'});run('npm',['ci','--omit=dev'],{cwd:target,stdio:'inherit'})}finally{await rm(temp,{recursive:true,force:true})}
 console.log('Verified private collector package installed.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await installBot();
