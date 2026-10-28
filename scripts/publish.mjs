import fs from 'node:fs';
import {build} from './build.mjs';
import {root} from './content.mjs';
build();
fs.cpSync(root+'/dist',root,{recursive:true});
console.log('Updated the repository-root website for GitHub Pages.');
