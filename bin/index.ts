import { program } from 'commander';
import { build } from './build';
import { createServer } from './dev/server';
import { dirname, join, resolve } from 'path';
import { mkdir, rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const getConfig = (path: string) => {
  const resolved = resolve(path);
  const module = require(resolved);
  const config = module.default || module;
  return {
    cwd: dirname(resolved),
    config,
  };
};

const dev = program.command('dev');
dev.argument('<config>', 'Path to config file');
dev.action(async (configLocation) => {
  const { cwd, config } = getConfig(configLocation);
  const bundler = await build(cwd, config);
  const server = createServer(bundler);
  server.listen(3000);
});

const bundle = program.command('build');
bundle.argument('<config>', 'Path to config file');
bundle.action(async (configLocation) => {
  const { cwd, config } = getConfig(configLocation);
  const bundler = await build(cwd, config);
  const outputDir = resolve('out');
  if (existsSync(outputDir)) {
    rm(outputDir, { recursive: true });
  }
  for (let path of bundler.paths) {
    await bundler.get(path)?.data;
  }
  for (let path of bundler.paths) {
    const asset = bundler.get(path);
    if (!asset) {
      throw new Error(`Asset not found for path: ${path}`);
    }
    const content = await asset.data;
    const target = join(outputDir, path);
    const targetDir = dirname(target);
    await mkdir(targetDir, { recursive: true });
    await writeFile(target, content.content);
    console.log(`Wrote ${target}`);
  }
  process.exit(0);
});

program.parse(process.argv);
