import { fileURLToPath} from 'url';
import { resolve, dirname } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { compile } from 'json-schema-to-typescript';

const root = fileURLToPath(new URL('..', import.meta.url));

const response = await fetch('https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json');
const schema = await response.json();

const types = await compile(schema, 'ResumeSchema', { bannerComment: '' });

const location = resolve(root, 'src/types/resume-schema.ts');
console.log(`Writing to ${location}`);
await mkdir(dirname(location), { recursive: true });
await writeFile(location, types);