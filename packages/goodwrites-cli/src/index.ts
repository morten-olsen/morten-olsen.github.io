import { program } from 'commander';
import { resolve, dirname } from 'path';
import { createServer } from '@morten-olsen/goodwrites-viewer';
import { readFile } from 'fs-extra';
import yaml from 'yaml';
import { parseDocument } from '@morten-olsen/goodwrites';

const dev = program.command('dev <file>');
dev.action(async (file) => {
  const fileLocation = resolve(process.cwd(), file);
  const server = createServer({
    dev: true,
    documentLocation: resolve(fileLocation),
  });
  server.listen(4005);
});

const build = program.command('build <file>');
build.action(async (file) => {
  const fileLocation = resolve(process.cwd(), file);
  const location = dirname(fileLocation);
  const content = await readFile(fileLocation, 'utf-8');
  const document = yaml.parse(content);
  const parsed = await parseDocument({
    document,
    location,
  });
  console.log(parsed.content);
});

program.parse(process.argv);
