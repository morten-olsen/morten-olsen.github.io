import express, { Express } from 'express';
import { Bundler } from '../bundler';
import { extname } from 'path';

const createServer = (bundler: Bundler): Express => {
  const app = express();
  app.use((req, res) => {
    let path = req.path;
    let asset = bundler.get(path);
    if (!asset) {
      path = path.endsWith('/') ? path + 'index.html' : path + '/index.html';
      asset = bundler.get(path);
    }
    if (asset) {
      const ext = extname(path);
      asset.data
        .then((data) => {
          if (ext === '.html') {
            const unsubscribe = asset!.subscribe(async () => {
              await asset?.data;
              unsubscribe();
              res.end('<script>window.location.reload()</script>');
            });
            res.on('close', unsubscribe);
            res.on('finish', unsubscribe);
            res.on('error', unsubscribe);
            res.writeHead(200, {
              'content-type': 'text/html;charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
              'keep-alive': 'timeout=5, max=100',
            });
            res.write(data.content.toString().replace('</html>', ''));
          } else {
            res.send(data.content);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err.message);
        });
    } else {
      res.status(404).send('Not found');
    }
  });

  return app;
};

export { createServer };
