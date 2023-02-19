import http from 'http';
import { create } from './create';

const run = async () => {
  const bundler = await create();

  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '', 'http://localhost:3000');
    const path = url.pathname;
    console.log('path', path);
    const file = bundler.get(path);
    res.writeHead(200);
    res.end(file?.content || 'Not found');
  });

  server.listen(3000);
  console.log('ready');
}

run();
