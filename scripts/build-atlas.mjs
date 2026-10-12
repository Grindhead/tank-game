import {readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const input=path.resolve('src/Resources/Images'),output=path.resolve('generated-assets');
const names=(await readdir(input)).filter(name=>name.toLowerCase().endsWith('.png')).sort();
if(!names.length)throw new Error('No PNG sprite assets found');
const images=await Promise.all(names.map(async name=>({name,file:path.join(input,name),metadata:await sharp(path.join(input,name)).metadata()})));
const width=Math.max(...images.map(image=>image.metadata.width)),height=images.reduce((total,image)=>total+image.metadata.height,0);
if(width>16384||height>16384)throw new Error('Sprite atlas exceeds the supported texture dimensions');
let y=0;const frames={},layers=[];
for(const image of images){const w=image.metadata.width,h=image.metadata.height;frames[image.name]={frame:{x:0,y,w,h},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w,h},sourceSize:{w,h}};layers.push({input:image.file,left:0,top:y});y+=h;}
await mkdir(output,{recursive:true});
await sharp({create:{width,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toFile(path.join(output,'atlas.png'));
await writeFile(path.join(output,'atlas.json'),JSON.stringify({frames,meta:{image:'atlas.png',size:{w:width,h:height},scale:'1'}},null,2)+'\n');
console.log(`Built ${names.length} sprite frames into ${width}x${height} atlas`);
